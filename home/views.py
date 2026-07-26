from django.shortcuts import render

from home.utils import AbstractObject, GeneratedImagePrompt
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
    def post(request):
        logger.debug("started")
        data = request.data
        prompt = AbstractObject(**data)
        result: list[str] = GeneratedImagePrompt.formatted_output(prompt=prompt)
        logger.debug("finished, status=success")
        return Response(data=result, status=status.HTTP_200_OK)
