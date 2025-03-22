from django.shortcuts import render
from django.http import HttpResponse
from myapp.models import BlogModel
import subprocess

def home(request):
    return render(request, 'home.html')

def apps(request):
    return render(request, "apps.html")

def blog(request):
    posts = BlogModel.objects.order_by("-created_at")
    return render(request, "blog.html", {"posts": posts})

def dino(request):
    return render(request, 'dino.html')