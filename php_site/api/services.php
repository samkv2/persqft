<?php
// ==========================================================
// PERSQFT CONSTRUCTIONS — SERVICES REST API (FULL CRUD & PUBLIC FEED)
// ==========================================================
header('Content-Type: application/json; charset=utf-8');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With');
header('Cache-Control: no-store, no-cache, must-revalidate, max-age=0');
header('Pragma: no-cache');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

require_once __DIR__ . '/../config/database.php';

$db = getDb();
$method = $_SERVER['REQUEST_METHOD'];

// Fallback seed services if database is still unmigrated or empty
function getFallbackServices() {
    return [
        [
            'id' => 1,
            'slug' => 'elevation-design',
            'title' => '3D Elevation Design',
            'tagline' => 'Modern, Aesthetic & Distinctive Facades',
            'category' => 'Design',
            'short_description' => 'Modern, aesthetic and functional elevations that make a lasting impression.',
            'description' => 'Make a lasting impression with hyper-realistic 3D elevations engineered with precise material specifications, lighting placements, and contemporary exterior finishes.',
            'image' => 'uploads/services/elevation.webp',
            'icon_name' => 'home',
            'brochure_pdf' => 'uploads/services/persqft_service_brochure_sample.pdf',
            'brochure_title' => 'Complete Elevation Design Dossier (PDF)',
            'deliverables' => '3D High-Res Renders + Color Code Schedule',
            'timeline' => '3 - 5 Working Days',
            'inclusions' => [
                'Photorealistic Day & Night 3D Views',
                'Complete Exterior Material & Texture Matrix',
                'Boundary Wall & Main Gate Coordinated CAD',
                'Exterior LED Lighting & Facade Fixtures Plan'
            ],
            'badge' => 'Popular',
            'sort_order' => 1,
            'published' => 1
        ],
        [
            'id' => 2,
            'slug' => 'interior-design',
            'title' => 'Luxury Interior Design & Fit-Out',
            'tagline' => 'Sophisticated Living Tailored to Your Taste',
            'category' => 'Interior',
            'short_description' => 'Thoughtfully designed interiors for beautiful, comfortable living.',
            'description' => 'From modular kitchens and custom false ceilings to premium woodwork, false flooring, and tailored ambient lighting for comfortable, contemporary living.',
            'image' => 'uploads/services/interior.webp',
            'icon_name' => 'palette',
            'brochure_pdf' => 'uploads/services/persqft_service_brochure_sample.pdf',
            'brochure_title' => 'Complete Luxury Interior Catalogue (PDF)',
            'deliverables' => '3D Walkthrough Renders + Carpentry CADs',
            'timeline' => '7 - 12 Working Days',
            'inclusions' => [
                'Room-by-Room 3D Interior Visualizations',
                'Modular Kitchen & Wardrobe Detail Drawings',
                'False Ceiling & Electrical Ambience Layouts',
                'Complete Material Selection & BoQ Assistance'
            ],
            'badge' => 'Popular',
            'sort_order' => 2,
            'published' => 1
        ],
        [
            'id' => 3,
            'slug' => 'floor-planning',
            'title' => 'Architectural Floor Planning & Vastu',
            'tagline' => 'Optimal Space Utilization & Natural Light',
            'category' => 'Planning',
            'short_description' => 'Smart space planning for maximum utility and better flow.',
            'description' => 'Smart 2D floor plans designed to maximize carpet area, optimize airflow, integrate cross-ventilation, and balance traditional Vastu principles with modern lifestyle needs.',
            'image' => 'uploads/services/planning.webp',
            'icon_name' => 'compass',
            'brochure_pdf' => 'uploads/services/persqft_service_brochure_sample.pdf',
            'brochure_title' => 'Architectural Vastu Planning Guide (PDF)',
            'deliverables' => '2D Architectural CAD Floor Plans (All Floors)',
            'timeline' => '2 - 4 Working Days',
            'inclusions' => [
                'Vastu-Compliant Zoning & Room Layouts',
                'Maximum Carpet Area to Built-Up Ratio',
                'Sun Path & Cross-Ventilation Engineering',
                'Furniture Flow & Space Optimization Maps'
            ],
            'badge' => null,
            'sort_order' => 3,
            'published' => 1
        ],
        [
            'id' => 4,
            'slug' => 'structural-drawings',
            'title' => 'Structural & Working Drawings',
            'tagline' => 'Earthquake-Resistant RCC Engineering Blueprints',
            'category' => 'Planning',
            'short_description' => 'Detailed architectural, structural and working drawings for a hassle-free build.',
            'description' => 'Rigorous structural calculations and detailed working drawings ensuring zero construction ambiguity on site, vetted by certified civil and structural engineers.',
            'image' => 'uploads/services/drawings.webp',
            'icon_name' => 'ruler',
            'brochure_pdf' => 'uploads/services/persqft_service_brochure_sample.pdf',
            'brochure_title' => 'Structural Engineering Specifications (PDF)',
            'deliverables' => 'Certified Construction Working Drawing Set',
            'timeline' => '5 - 7 Working Days',
            'inclusions' => [
                'Foundation, Column Footing & Plinth Beam CADs',
                'RCC Slab & Beam Steel Reinforcement Schedules',
                'Plumbing (Water Supply & Drainage) Blueprints',
                'Concealed Electrical Conduit Line Maps'
            ],
            'badge' => null,
            'sort_order' => 4,
            'published' => 1
        ],
        [
            'id' => 5,
            'slug' => 'turnkey-construction',
            'title' => 'Turnkey Residential Construction',
            'tagline' => 'End-to-End Home Building with Guaranteed Quality',
            'category' => 'Construction',
            'short_description' => 'Complete hassle-free residential construction from foundation to final handover.',
            'description' => 'Complete hassle-free residential construction from soil testing and excavation to RCC framing, brickwork, finishing, and key handover with zero cost-escalation.',
            'image' => 'uploads/services/turnkey.webp',
            'icon_name' => 'building',
            'brochure_pdf' => 'uploads/services/persqft_service_brochure_sample.pdf',
            'brochure_title' => 'Turnkey Construction Contract & BoQ Dossier (PDF)',
            'deliverables' => 'Move-in Ready Handover with Warranty',
            'timeline' => '6 - 12 Months',
            'inclusions' => [
                'Grade-A Certified Cement, Steel & Raw Materials',
                'Daily/Weekly Photographic Progress Reports',
                'Dedicated On-Site Civil Project Engineer',
                'Lab Quality Testing for Concrete & Compaction'
            ],
            'badge' => 'Popular',
            'sort_order' => 5,
            'published' => 1
        ],
        [
            'id' => 6,
            'slug' => 'commercial-projects',
            'title' => 'Commercial Complexes & Plazas',
            'tagline' => 'High-Footfall Retail & Office Infrastructure',
            'category' => 'Construction',
            'short_description' => 'High-performance commercial complexes with compliant setbacks and maximum FAR.',
            'description' => 'Engineered commercial buildings, shopping arcades, and corporate spaces with compliant municipal setback parameters, maximum permissible FAR, and durable modern finishes.',
            'image' => 'uploads/services/drawings.webp',
            'icon_name' => 'layers',
            'brochure_pdf' => 'uploads/services/persqft_service_brochure_sample.pdf',
            'brochure_title' => 'Commercial Infrastructure Dossier (PDF)',
            'deliverables' => 'Commercial Structural & Architectural Set',
            'timeline' => 'Tailored to Scope',
            'inclusions' => [
                'Municipal Byelaw & Road Width FAR Optimization',
                'Basement Parking & Fire Exit Planning',
                'High-Load Capacity Commercial Frame Engineering',
                'Glass Facade & Composite Panel Cladding Specs'
            ],
            'badge' => null,
            'sort_order' => 6,
            'published' => 1
        ],
        [
            'id' => 7,
            'slug' => 'renovation-remodeling',
            'title' => 'Structural Renovation & Remodeling',
            'tagline' => 'Transforming Aging Structures into Modern Spaces',
            'category' => 'Construction',
            'short_description' => 'Structural reinforcement, space reconfiguration, and modern facade upgrades.',
            'description' => 'Reinforce old foundation beams, reconfigure cramped room divisions, update exterior facades, and modernize legacy plumbing and electrical systems with precision.',
            'image' => 'uploads/services/elevation.webp',
            'icon_name' => 'wrench',
            'brochure_pdf' => 'uploads/services/persqft_service_brochure_sample.pdf',
            'brochure_title' => 'Renovation Audit & Remodeling Dossier (PDF)',
            'deliverables' => 'Remodeling Blueprint + Bill of Quantities',
            'timeline' => '3 - 8 Weeks',
            'inclusions' => [
                'Existing Structure Health & Load Bearing Audit',
                'Space Reconfiguration & Wall Demolition Plans',
                'Modern Facade Replacement & Surface Upgrades',
                'Waterproofing & Damp-Proof Chemical Injections'
            ],
            'badge' => null,
            'sort_order' => 7,
            'published' => 1
        ]
    ];
}

// 1. GET: Fetch services (Public)
if ($method === 'GET') {
    $category = $_GET['category'] ?? null;
    $singleId = $_GET['id'] ?? null;
    $singleSlug = $_GET['slug'] ?? null;

    if ($singleId || $singleSlug) {
        $item = getService($singleId ?: $singleSlug);
        if ($item) {
            if (!empty($item['inclusions']) && is_string($item['inclusions'])) {
                $decoded = json_decode($item['inclusions'], true);
                $item['inclusions'] = is_array($decoded) ? $decoded : array_filter(array_map('trim', explode("\n", $item['inclusions'])));
            }
            echo json_encode(['success' => true, 'service' => $item]);
            exit();
        }
    }

    $services = getServices($category);

    // Fall back to seed data if database table is not yet created or has 0 rows
    if (empty($services)) {
        $services = getFallbackServices();
        if ($category && $category !== 'All') {
            $services = array_values(array_filter($services, function($s) use ($category) {
                return strtolower($s['category']) === strtolower($category);
            }));
        }
    } else {
        foreach ($services as &$s) {
            if (!empty($s['inclusions']) && is_string($s['inclusions'])) {
                $decoded = json_decode($s['inclusions'], true);
                $s['inclusions'] = is_array($decoded) ? $decoded : array_filter(array_map('trim', explode("\n", $s['inclusions'])));
            } else if (empty($s['inclusions'])) {
                $s['inclusions'] = [];
            }
        }
    }

    echo json_encode(['success' => true, 'services' => $services]);
    exit();
}

// Check admin auth for modifying services via API
require_once __DIR__ . '/../admin/auth.php';
if (!isAdminLoggedIn()) {
    http_response_code(401);
    echo json_encode(['success' => false, 'message' => 'Unauthorized']);
    exit();
}

function getPayload() {
    $raw = file_get_contents('php://input');
    if (!empty($raw)) {
        $json = json_decode($raw, true);
        if (is_array($json)) return $json;
    }
    return $_POST;
}

// 2. DELETE: Remove a service
if ($method === 'DELETE') {
    $id = (int)($_GET['id'] ?? 0);
    if ($id <= 0) {
        http_response_code(400);
        echo json_encode(['success' => false, 'message' => 'Invalid service ID']);
        exit();
    }

    try {
        $stmtOld = $db->prepare("SELECT image, brochure_pdf FROM services WHERE id = ? LIMIT 1");
        $stmtOld->execute([$id]);
        $old = $stmtOld->fetch();
        if ($old) {
            if (!empty($old['image'])) cleanOldUpload($old['image']);
            if (!empty($old['brochure_pdf'])) cleanOldUpload($old['brochure_pdf']);
        }

        $stmt = $db->prepare("DELETE FROM services WHERE id = ?");
        $stmt->execute([$id]);
        echo json_encode(['success' => true, 'message' => 'Service deleted successfully']);
        exit();
    } catch (Exception $e) {
        http_response_code(500);
        echo json_encode(['success' => false, 'message' => $e->getMessage()]);
        exit();
    }
}

http_response_code(405);
echo json_encode(['success' => false, 'message' => 'Method not allowed']);
exit();
