from django.http import HttpResponse

def home(request):
    return HttpResponse("Hello World! Welcome to Home page of Smart-Edu.")

def about(request):
    return HttpResponse("Hello World! Welcome to About page of Smart-Edu.")

def contact(request):
    return HttpResponse("Hello World! Welcome to Contact page of Smart-Edu.")
