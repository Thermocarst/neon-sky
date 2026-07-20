from django.db import models
from django.contrib.auth.models import AbstractUser
from django.utils.translation import gettext_lazy as _

from user.managers import CustomUserManager

# Create your models here.

class User(AbstractUser):
    
    class Role(models.TextChoices):
        NOT_SET = "Not selected"

    slug: str = models.SlugField(unique=True)
    # phone: str = models.CharField(max_length=17, null=True, blank=True,
    #                               verbose_name=_("phone"), help_text="+380 55 123 45 67")
    role: str = models.CharField(max_length=12, choices=Role.choices, default=Role.NOT_SET, verbose_name=_("role"))

    USERNAME_FIELD = "email"
    email = models.EmailField(unique=True)
    REQUIRED_FIELDS = []

    objects = CustomUserManager()
