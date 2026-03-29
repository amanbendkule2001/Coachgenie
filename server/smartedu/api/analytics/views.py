"""
api/analytics/views.py
Aggregate read-only endpoints — no models needed.
"""

from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from django.db.models import Avg, Sum, Count, Q
from django.utils import timezone

from api.students.models import Student
from api.courses.models import Course
from api.fees.models import Payment
from api.tests_marks.models import Test, Mark
from api.enquiries.models import Enquiry
from api.todos.models import Todo
from api.activities.models import Activity


class DashboardStatsView(APIView):
    """GET /api/analytics/dashboard/ — top-level KPI cards"""
    permission_classes = [IsAuthenticated]

    def get(self, request):
        tutor = request.user
        today = timezone.now().date()

        total_students  = Student.objects.filter(tutor=tutor, status="Active").count()
        total_courses   = Course.objects.filter(tutor=tutor, status="Active").count()
        upcoming_events = Activity.objects.filter(tutor=tutor, start_date__gte=today).count()
        pending_fees    = Payment.objects.filter(tutor=tutor, status__in=["Pending","Overdue"]).aggregate(
            total=Sum("amount"))["total"] or 0
        revenue_collected = Payment.objects.filter(tutor=tutor, status="Paid").aggregate(
            total=Sum("amount"))["total"] or 0
        pending_todos   = Todo.objects.filter(tutor=tutor, completed=False).count()

        return Response({
            "total_students":     total_students,
            "total_courses":      total_courses,
            "upcoming_events":    upcoming_events,
            "pending_fees":       float(pending_fees),
            "revenue_collected":  float(revenue_collected),
            "pending_todos":      pending_todos,
        })


class StudentPerformanceView(APIView):
    """GET /api/analytics/performance/ — student performance insights"""
    permission_classes = [IsAuthenticated]

    def get(self, request):
        tutor = request.user
        students = Student.objects.filter(tutor=tutor)

        avg_score   = students.aggregate(avg=Avg("score"))["avg"] or 0
        at_risk     = students.filter(Q(score__lt=50) | Q(status="At Risk")).count()
        top_perf    = students.filter(score__gte=85).count()
        active      = students.filter(status="Active").count()
        total       = students.count()

        score_dist = {
            "90_100": students.filter(score__gte=90).count(),
            "75_89":  students.filter(score__gte=75, score__lt=90).count(),
            "50_74":  students.filter(score__gte=50, score__lt=75).count(),
            "below_50": students.filter(score__lt=50).count(),
        }

        return Response({
            "avg_score":     round(avg_score, 1),
            "at_risk_count": at_risk,
            "top_performers": top_perf,
            "active_students": active,
            "total_students":  total,
            "score_distribution": score_dist,
        })


class RevenueAnalyticsView(APIView):
    """GET /api/analytics/revenue/ — fee & payment analytics"""
    permission_classes = [IsAuthenticated]

    def get(self, request):
        tutor = request.user
        payments = Payment.objects.filter(tutor=tutor)

        summary = payments.aggregate(
            total_billed   = Sum("amount"),
            total_collected= Sum("amount", filter=Q(status="Paid")),
            total_pending  = Sum("amount", filter=Q(status="Pending")),
            total_overdue  = Sum("amount", filter=Q(status="Overdue")),
        )

        by_method = list(
            payments.filter(status="Paid")
            .values("method")
            .annotate(total=Sum("amount"), count=Count("id"))
            .order_by("-total")
        )

        return Response({
            "summary":   {k: float(v or 0) for k, v in summary.items()},
            "by_method": by_method,
        })


class EnquiryFunnelView(APIView):
    """GET /api/analytics/enquiries/ — CRM funnel"""
    permission_classes = [IsAuthenticated]

    def get(self, request):
        tutor = request.user
        stages = Enquiry.objects.filter(tutor=tutor).values("stage").annotate(count=Count("id"))
        sources = Enquiry.objects.filter(tutor=tutor).values("source").annotate(count=Count("id"))

        return Response({
            "by_stage":  list(stages),
            "by_source": list(sources),
            "total":     Enquiry.objects.filter(tutor=tutor).count(),
        })
