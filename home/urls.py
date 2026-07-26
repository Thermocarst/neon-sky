from django.urls import path

from home.views import HomeView


urlpatterns = [
    path("", HomeView.get, name="home"),
    path("api/home/post", HomeView.post, name="post"),
]
