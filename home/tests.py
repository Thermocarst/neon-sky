from django.test import TestCase
from django.urls import reverse, resolve
from django.http.response import HttpResponse

from home.utils import AbstractObject, GeneratedImagePrompt
from home.views import HomeView

# Create your tests here.


class ViewsTestCase(TestCase):

    def test_get(self):
        url: str = reverse("home")
        response: HttpResponse = self.client.get(url)
        self.assertEqual(response.status_code, 200)
        self.assertEqual(url, "/")
        self.assertEqual(resolve(url).func, HomeView.get)
        self.assertTemplateUsed(response, "home/index.html")

class UtilsTestCase(TestCase):

    def test__formatted_row(self):
        row: str = "**hello world  "
        result: str = GeneratedImagePrompt._formatted_row(row)
        expected: str = "hello world"
        self.assertEqual(result, expected)

    def test__formatted_output(self):
        """
        Because ignored 0 idx first el of list don't append to result
        """
        text: list[str] = ["description", "1. prompt title", "some text 1 qwerty", "", 
                           "2. prompt title", "some text 2 qwerty"]
        result: list[str] = GeneratedImagePrompt._formatted_output(text)
        expected: list[str] = ["prompt title some text 1 qwerty", "prompt title some text 2 qwerty", ]
        self.assertEqual(result, expected)

        text: list[str] = ["description", "###1", "some text 1 qwerty", "", 
                           "###2", "some text 2 qwerty"]
        result: list[str] = GeneratedImagePrompt._formatted_output(text)
        expected: list[str] = ["some text 1 qwerty", "some text 2 qwerty", ]
        self.assertEqual(result, expected)

        text: list[str] = ["description", "1. prompt title", ", ", "some text 1 qwerty", "", 
                           "2. prompt title", ", ", "some text 2 qwerty"]
        result: list[str] = GeneratedImagePrompt._formatted_output(text)
        expected: list[str] = ["prompt title some text 1 qwerty", "prompt title some text 2 qwerty", ]
        self.assertEqual(result, expected)

        text: list[str] = ["description", "1. prompt title", "**prompt:**", "some text 1 qwerty", "", 
                           "2. prompt title", "**prompt**", "some text 2 qwerty"]
        result: list[str] = GeneratedImagePrompt._formatted_output(text)
        expected: list[str] = ["prompt title some text 1 qwerty", "prompt title some text 2 qwerty", ]
        self.assertEqual(result, expected)

        text: list[str] = ["description", "1. prompt text 1 qwerty", "", "", 
                            "2. prompt text 2 qwerty", "", ""]
        result: list[str] = GeneratedImagePrompt._formatted_output(text)
        expected: list[str] = ["prompt text 1 qwerty", "prompt text 2 qwerty", ]
        self.assertEqual(result, expected)

        text: list[str] = ["description", 
                           "### 1) prompt title", "**Prompt:**  ", "prompt text 1 qwerty",
                           "### 2) prompt title", "**Prompt:**  ", "prompt text 2 qwerty"]
        result: list[str] = GeneratedImagePrompt._formatted_output(text)
        expected: list[str] = ["prompt title prompt text 1 qwerty", 
                               "prompt title prompt text 2 qwerty", ]
        self.assertEqual(result, expected)