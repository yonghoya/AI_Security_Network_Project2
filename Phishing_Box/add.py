# urls.py

from django.urls import path
from . import views

urlpatterns = [
    # 다른 URL 패턴들 ...
    path('api/endpoint/', views.url_check_endpoint, name='url_check_endpoint'),
]


# views.py

from django.http import JsonResponse

def url_check_endpoint(request):
    if request.method == 'POST':
        data = json.loads(request.body)
        url_to_check = data.get('url')

        # 여기에서 URL 확인 로직을 수행하고 결과를 result 변수에 할당
        result = check_url(url_to_check)

        # 결과를 JSON 응답으로 반환
        return JsonResponse({'result': result})
