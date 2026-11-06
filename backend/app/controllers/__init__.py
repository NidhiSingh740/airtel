from backend.app.controllers.registry_controller import router as registry_router
from backend.app.controllers.catalog_controller import router as catalog_router
from backend.app.controllers.advisor_controller import router as advisor_router
from backend.app.controllers.kyc_controller import router as kyc_router
from backend.app.controllers.analytics_controller import router as analytics_router
from backend.app.controllers.orders_controller import router as orders_router

__all__ = [
    "registry_router",
    "catalog_router",
    "advisor_router",
    "kyc_router",
    "analytics_router",
    "orders_router",
]
