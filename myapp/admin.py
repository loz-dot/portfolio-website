from django.contrib import admin
from .models import BlogModel  # Import your BlogPost model

# Register the model to appear in the admin panel
@admin.register(BlogModel)
class BlogPostAdmin(admin.ModelAdmin):
    list_display = ("title", "created_at")  # Fields to show in the admin list
    search_fields = ("title", "content", "summary")  # Enable searching in admin panel
    list_filter = ("created_at",)  # Filter posts by date