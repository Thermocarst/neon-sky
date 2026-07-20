from django.contrib import admin
from user.models import User
# Register your models here.

@admin.register(User)
class UserAdmin(admin.ModelAdmin):
	list_display = ("email", "username", )
	list_display_links = ("email", "username", )
	# prepopulated_fields = {"slug": ("username", )}
	# read_only_fields = ("created_at", )