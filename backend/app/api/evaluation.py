"""
Evaluation API router for running live scenario testing and calculating metrics.
"""

from fastapi import APIRouter
from app.schemas.schemas import EvaluationReport
from app.evaluation.evaluator import evaluator

router = APIRouter(prefix="/evaluation", tags=["Evaluation Metrics Harness"])

@router.get("/run", response_model=EvaluationReport)
def run_evaluation():
    """
    Executes the 30 evaluation scenarios programmatically and calculates real metrics.
    """
    return evaluator.run_all()
