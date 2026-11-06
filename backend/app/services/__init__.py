# backend/app/services/__init__.py
from backend.app.config import DATA_DIR
from backend.app.services.registry_service import RegistryService
from backend.app.services.catalog_service import CatalogService
from backend.app.services.kyc_validator import KYCValidator
from backend.app.services.ocr_service import DocumentOCRService
from backend.app.services.scoring_service import PropensityScoringService
from backend.app.services.advisor_service import ConversationalAdvisor
from backend.app.services.gemini_service import GeminiAdvisorService

# Singleton service instances initialized with central DATA_DIR
registry_service = RegistryService(DATA_DIR)
catalog_service = CatalogService(DATA_DIR)
kyc_validator = KYCValidator(registry_service)
scoring_service = PropensityScoringService(DATA_DIR)
advisor_service = ConversationalAdvisor(catalog_service, registry_service)
gemini_service = GeminiAdvisorService(catalog_service, registry_service)

_ocr_service = None
def get_ocr_service():
    global _ocr_service
    if _ocr_service is None:
        _ocr_service = DocumentOCRService(use_gpu=False)
    return _ocr_service

__all__ = [
    "registry_service",
    "catalog_service",
    "kyc_validator",
    "scoring_service",
    "advisor_service",
    "gemini_service",
    "get_ocr_service"
]
