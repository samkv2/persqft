import React, { useState, useEffect, useRef } from 'react';
import { BellRing, CheckCircle2, X, AlertCircle } from 'lucide-react';

interface NotificationCardProps {
  visible?: boolean;
}

export const NotificationCard: React.FC<NotificationCardProps> = ({ visible = true }) => {
  const [isMounted, setIsMounted] = useState(false);
  const [isActive, setIsActive] = useState(false);
  const [status, setStatus] = useState<'prompt' | 'requesting' | 'granted' | 'denied'>('prompt');
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Helper: Universal push notification dispatcher (Service Worker on Android Chrome + desktop fallback)
  const triggerNativeNotification = async (title: string, options: { body: string; icon?: string; badge?: string; url?: string }) => {
    // 1. Service Worker showNotification (Strictly REQUIRED for Chrome on Android)
    if (typeof window !== 'undefined' && 'serviceWorker' in navigator) {
      try {
        const reg = await navigator.serviceWorker.ready;
        if (reg && reg.showNotification) {
          await reg.showNotification(title, {
            body: options.body,
            icon: options.icon || '/favicon.svg',
            badge: options.badge || '/favicon.svg',
            vibrate: [150, 50, 150],
            data: { url: options.url || 'https://persqftconstructions.com/#projects' }
          } as any);
          return;
        }
      } catch (swErr) {
        console.warn('SW showNotification error:', swErr);
      }
    }

    // 2. Window Notification constructor (Desktop browsers)
    try {
      const n = new Notification(title, {
        body: options.body,
        icon: options.icon || '/favicon.svg',
        badge: options.badge || '/favicon.svg'
      });
      if (options.url) {
        n.onclick = (e) => {
          e.preventDefault();
          window.focus();
          window.open(options.url, '_blank');
          n.close();
        };
      }
    } catch (windowErr) {
      console.warn('Window Notification fallback error:', windowErr);
    }
  };

  // Helper: Synchronize subscriber registration with MySQL backend
  const syncSubscriberBackend = async () => {
    try {
      const res = await fetch('/api/subscribers.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        keepalive: true,
        body: JSON.stringify({
          action: 'subscribe',
          userAgent: navigator.userAgent,
          timestamp: new Date().toISOString()
        })
      });
      const data = await res.json();
      if (data && data.success) {
        localStorage.setItem('persqft_alerts_subscribed', 'true');
      }
    } catch (err) {
      console.warn('Subscriber sync error:', err);
    }
  };

  // Check for newly broadcasted alerts from CMS for subscribed users
  useEffect(() => {
    if (typeof window === 'undefined' || !('Notification' in window)) return;
    if (Notification.permission !== 'granted') return;

    const pollForBroadcasts = async () => {
      try {
        let lastSeenId = 0;
        try {
          lastSeenId = Number(localStorage.getItem('persqft_last_seen_alert_id') || '0');
        } catch {}

        const res = await fetch(`/api/alerts.php?since_id=${lastSeenId}&_t=${Date.now()}`);
        if (!res.ok) return;
        const data = await res.json();

        if (data.success && Array.isArray(data.alerts) && data.alerts.length > 0) {
          let maxId = lastSeenId;
          for (const alert of data.alerts) {
            if (alert.id > maxId) maxId = alert.id;

            // Dispatch native notification via Service Worker / Window
            await triggerNativeNotification(alert.title, {
              body: alert.message,
              icon: alert.icon || '/favicon.svg',
              badge: '/favicon.svg',
              url: alert.url
            });
          }

          try {
            localStorage.setItem('persqft_last_seen_alert_id', String(maxId));
          } catch {}
        }
      } catch {}
    };

    // Check immediately on load
    pollForBroadcasts();

    // Check periodically every 25 seconds
    const interval = setInterval(pollForBroadcasts, 25000);

    // Check when tab becomes visible
    const onVisibility = () => {
      if (document.visibilityState === 'visible') {
        pollForBroadcasts();
      }
    };
    document.addEventListener('visibilitychange', onVisibility);

    return () => {
      clearInterval(interval);
      document.removeEventListener('visibilitychange', onVisibility);
    };
  }, [status]);

  // Allow manual trigger from Footer or external buttons
  useEffect(() => {
    const handleOpenCard = () => {
      setIsMounted(true);
      setTimeout(() => setIsActive(true), 40);
    };
    window.addEventListener('open-subscribe-card', handleOpenCard);
    return () => window.removeEventListener('open-subscribe-card', handleOpenCard);
  }, []);

  useEffect(() => {
    // Register Service Worker if supported
    if (typeof window !== 'undefined' && 'serviceWorker' in navigator) {
      navigator.serviceWorker.register('/sw.js').catch(() => {});
    }

    // If permission already granted in browser, ensure subscriber is registered in MySQL backend
    if (typeof window !== 'undefined' && 'Notification' in window && Notification.permission === 'granted') {
      syncSubscriberBackend();
      return;
    }

    // If user already subscribed previously, don't show card again
    try {
      if (localStorage.getItem('persqft_alerts_subscribed') === 'true') {
        return;
      }
    } catch {}

    // Mount and smoothly float in after 2.8s on ALL devices including iPhone / iPad
    timerRef.current = setTimeout(() => {
      setIsMounted(true);
      // Small timeout to guarantee DOM paint before triggering float-in transition
      setTimeout(() => {
        setIsActive(true);
      }, 60);
    }, 2800);

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, []);

  const handleDismiss = () => {
    // Trigger smooth float-out animation
    setIsActive(false);
    // Unmount after smooth 700ms transition finishes
    setTimeout(() => {
      setIsMounted(false);
    }, 700);
  };

  const handleEnableNow = async () => {
    setStatus('requesting');

    // 1. If Web Notification API is natively supported (Desktop, Android Chrome)
    if (typeof window !== 'undefined' && 'Notification' in window && typeof Notification.requestPermission === 'function') {
      try {
        const permission = await Notification.requestPermission();

        if (permission === 'granted') {
          setStatus('granted');

          // Immediately sync subscriber with MySQL backend API
          await syncSubscriberBackend();

          // Dispatch welcome confirmation notification (Works on Android via Service Worker)
          await triggerNativeNotification('PERSQFT CONSTRUCTIONS', {
            body: "Alerts enabled! You'll receive real-time updates on luxury projects & sqft rates.",
            icon: '/favicon.svg',
            badge: '/favicon.svg',
            url: 'https://persqftconstructions.com/#projects'
          });

          // Auto-close smoothly after 2.5 seconds
          setTimeout(() => {
            handleDismiss();
          }, 2500);
          return;
        } else if (permission === 'denied') {
          setStatus('denied');
          setTimeout(() => {
            handleDismiss();
          }, 2500);
          return;
        }
      } catch (err) {
        console.warn('Notification permission error:', err);
      }
    }

    // 2. Fallback for iPhone / iPad Safari / Browsers without native Push Notification API:
    // Register subscriber in MySQL backend and show successful subscribed state!
    await syncSubscriberBackend();
    setStatus('granted');
    setTimeout(() => {
      handleDismiss();
    }, 2600);
  };

  if (!visible || !isMounted) return null;

  return (
    <aside
      aria-label="Exclusive Construction Alerts"
      className={`fixed right-4 sm:right-7 bottom-36 sm:bottom-40 z-40 max-w-[360px] w-[calc(100vw-2rem)] sm:w-[360px] select-none transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] transform ${
        isActive
          ? 'opacity-100 translate-y-0 scale-100 pointer-events-auto'
          : 'opacity-0 translate-y-16 sm:translate-y-20 scale-95 pointer-events-none'
      }`}
    >
      <div className="relative overflow-hidden rounded-[10px] bg-white border border-[#F1EFEC] shadow-[0_12px_40px_rgba(38,50,56,0.12)] p-4 sm:p-5 hover:border-[#FF6F2C]/40 transition-colors duration-300">
        
        {/* Subtle Brand Accent Line on Top */}
        <div className="absolute top-0 inset-x-0 h-1 bg-[#FF6F2C]" />

        {/* Close Button */}
        <button
          type="button"
          onClick={handleDismiss}
          aria-label="Dismiss alert prompt"
          className="absolute top-3 right-3 text-[#667078] hover:text-[#263238] p-1 rounded-[6px] transition-colors cursor-pointer hover:bg-[#FAF8F5]"
        >
          <X className="w-4 h-4" />
        </button>

        {status === 'granted' ? (
          /* Success State */
          <div className="flex items-center space-x-3.5 py-1">
            <div className="w-10 h-10 rounded-[8px] bg-emerald-50 border border-emerald-200 flex items-center justify-center shrink-0 text-emerald-600">
              <CheckCircle2 className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-['Montserrat',sans-serif] font-semibold text-sm text-[#263238] tracking-tight">
                Alerts Activated!
              </h4>
              <p className="text-xs text-[#667078] font-['Inter',sans-serif] leading-tight mt-0.5">
                You're all set to receive real-time project & cost updates.
              </p>
            </div>
          </div>
        ) : status === 'denied' ? (
          /* Denied State */
          <div className="flex items-center space-x-3.5 py-1">
            <div className="w-10 h-10 rounded-[8px] bg-rose-50 border border-rose-200 flex items-center justify-center shrink-0 text-rose-600">
              <AlertCircle className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-['Montserrat',sans-serif] font-semibold text-sm text-[#263238] tracking-tight">
                Notifications Blocked
              </h4>
              <p className="text-xs text-[#667078] font-['Inter',sans-serif] leading-tight mt-0.5">
                You can re-enable alerts anytime in your browser settings.
              </p>
            </div>
          </div>
        ) : (
          /* Default Prompt State */
          <div className="flex items-start space-x-3.5">
            {/* Bell Icon with Subtle Ambient Glow */}
            <div className="w-10 h-10 rounded-[8px] bg-[#FFF1E9] border border-[#FFF1E9] flex items-center justify-center shrink-0 mt-0.5 text-[#FF6F2C]">
              <BellRing className="w-5 h-5 animate-pulse" />
            </div>

            {/* Content & Action Buttons */}
            <div className="flex-1 pr-4">
              <h4 className="font-['Montserrat',sans-serif] font-semibold text-sm text-[#263238] tracking-tight leading-snug">
                Exclusive Property Alerts
              </h4>
              <p className="text-xs text-[#667078] font-['Inter',sans-serif] leading-relaxed mt-1">
                Get instant alerts on luxury villa launches, turnkey cost/sqft trends & project milestones in Sultanpur & UP.
              </p>

              {/* Action Buttons */}
              <div className="flex items-center space-x-3 mt-3.5">
                <button
                  type="button"
                  onClick={handleEnableNow}
                  disabled={status === 'requesting'}
                  className="px-4 py-2 rounded-[8px] bg-[#FF6F2C] hover:bg-[#E85B1E] text-white font-['Montserrat',sans-serif] font-semibold text-xs shadow-xs transition-all duration-200 cursor-pointer active:scale-98 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {status === 'requesting' ? 'Requesting...' : 'Enable Now'}
                </button>

                <button
                  type="button"
                  onClick={handleDismiss}
                  className="px-2 py-2 text-xs font-['Montserrat',sans-serif] font-medium text-[#667078] hover:text-[#263238] transition-colors cursor-pointer"
                >
                  Not Now
                </button>
              </div>
            </div>
          </div>
        )}

      </div>
    </aside>
  );
};
