from django.urls import path
from .views import modsView, sessionViews

urlpatterns = [
    path('', modsView.as_view()),
    path('<str:course>', sessionViews.as_view())
]