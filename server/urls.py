from rest_framework.routers import DefaultRouter
from server.views import *

router = DefaultRouter()
router.register(prefix='courses', viewset=CourseViewSet)
router.register(prefix='scores', viewset=ScoreViewSet)

urlpatterns = router.urls
