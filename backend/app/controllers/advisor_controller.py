from fastapi import APIRouter

from backend.app.models.schemas import ChatRequest
from backend.app.services import advisor_service

router = APIRouter(prefix="/api", tags=["Advisor Chat"])


@router.post("/chat")
def chat_with_advisor(req: ChatRequest):
    """Run the fixed four-question needs assessment before suggesting plans."""
    context = req.context or {}
    state = dict(req.state or {})
    if not state:
        state = {
            "step": context.get("step", 1),
            "business_type": context.get("businessType"),
            "employee_count": context.get("employeeCount"),
            "num_sites": context.get("numSites") or 1,
            "city_tier": context.get("cityTier") or 2,
        }

    result = advisor_service.handle_message(
        message=req.message.strip(), state=state,
        lang=context.get("language") or req.language,
    )
    actions = {
        "This looks expensive": "TOO_EXPENSIVE",
        "View full quote": "VIEW_QUOTE",
        "Proceed to Smart KYC": "START_KYC",
        "Start over": "START_OVER",
    }
    result["options"] = [
        {"label": reply, "value": actions.get(reply, reply)}
        for reply in result.get("quick_replies", [])
    ]
    return result
