from django.shortcuts import render

from rest_framework import status
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework.decorators import api_view, permission_classes

from logger.settings import logger

# Create your views here.

class HomeView:

    @staticmethod
    def get(request):
        return render(request=request, template_name="home/index.html")

    @api_view(["POST"])
    @staticmethod
    def post_prompts(request):
        logger.debug("started")
        data = {}
        logger.debug("finished, status=success")
        return Response(data=data, status=status.HTTP_200_OK)