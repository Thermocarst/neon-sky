import os
import requests
from dataclasses import dataclass

from dotenv import load_dotenv
load_dotenv()   

from logger.settings import logger


@dataclass
class AbstractObject:
    main_character: str
    action: str
    details: str
    environment: str
    lighting: str
    mood: str
    art_style: str
    camera_angles: str

    def __str__(self):
        res = [value for key, value in self.__dict__.items() if value]
        return ", ".join(res)
    

class GeneratedImagePrompt:

    @staticmethod
    def _retrieved_data(prompt: AbstractObject) -> str:
        """
        :param prompt: <class 'home.utils.AbstractObject'>
        :return: str
        """
        logger.debug("started")
        base_prompt = f"write 5 variants of optimized prompts for ai model to generate image and translate it to egnlish language "
        have_no_inet_prompt = 'Here are 5 optimized prompt variants for generating the image in English:\n\n1. **Young Chinese woman holding an umbrella, wearing a green dress, standing beside a waterfall and lake, water droplets falling onto the umbrella, golden hour sunset lighting, joyful mood, photorealistic, 35mm film photography.**\n\n2. **Photorealistic 35mm film photo of a young Chinese woman in a green dress holding an umbrella near a waterfall and lake, droplets of water hitting the umbrella, warm golden hour sunset light, joyful expression, natural and cinematic.**\n\n3. **A joyful young Chinese woman wearing a green dress and holding an umbrella, posed beside a waterfall and calm lake, raindrops and water droplets falling on the umbrella, glowing sunset golden hour, ultra photorealistic, shot on 35mm film.**\n\n4. **Young Chinese woman with a green dress holding an umbrella next to a waterfall and lake, water droplets splashing onto the umbrella, soft golden hour sunset illumination, happy and serene mood, realistic 35mm film photography.**\n\n5. **Cinematic photorealistic portrait of a young Chinese woman in a green dress holding an umbrella by a waterfall and lake, droplets falling onto the umbrella, beautiful golden hour sunset light, joyful atmosphere, 35mm analog film look.**\n\nIf you want, I can also make these:\n- **more cinematic**\n- **more detailed for Midjourney**\n- **optimized for Stable Diffusion**\n- **with a negative prompt**'
        try:
            r = requests.post(
                url="https://api.openai.com/v1/responses",
                headers={
                    "Content-Type": "application/json", 
                    "Authorization": f"Bearer {os.environ.get('OPEN_AI_BEARER')}"
                },
                json={
                    "model": "gpt-5.4-mini",
                    "input": f"{base_prompt} {prompt}",
                    "store": True
                    }
                )
            data: dict[str: str] = r.json()
            text: str = data["output"][0]["content"][0]["text"]
            logger.debug("finished, status=success")
            return text
        except requests.exceptions.ConnectionError as e:
            logger.debug("finished, status=error\n%s" % e)
            return "\n1. Have no access to internet\n" + have_no_inet_prompt
        except requests.exceptions.ConnectTimeout as e:
            logger.debug("finished, status=error\n%s" % e)
            return "\n2. Connection timeout\n" + have_no_inet_prompt
        except Exception as e:
            logger.debug("finished, status=unexpected error\n%s" % e)
            return "\n3. Unexpected error\n" + have_no_inet_prompt

    @staticmethod
    def formatted_output(prompt: AbstractObject) -> list[str]:
        """
        :param prompt: <class 'home.utils.AbstractObject'>
        :return: list[str]
        """
        logger.debug("started")
        rows: list[str] = GeneratedImagePrompt._retrieved_data(prompt).split("\n")
        formatted_rows = GeneratedImagePrompt._formatted_output(rows)
        logger.debug("finished, status=success")
        return formatted_rows

    @staticmethod
    def _formatted_output(text: list[str]) -> str:
        """
        :param text: list[str]
            example: ["1. prompt title", "some text 1 qwerty", "", "2. prompt title", "some text 2 qwerty"]
        :return: list[str]
            example: ["prompt title some text 2 qwerty", ]
            explanation: because ignored 0 idx first el of list don't append to result
        
        Find prompt rows by forward digits and append it to new list
        """
        logger.debug("started")
        result = []
        for i in range(1, len(text)-1):
            try:
                row: str = GeneratedImagePrompt._formatted_row(text[i])
                if row[0].isdigit():
                    if "prompt" in text[i+1].lower() or text[i+1] and len(text[i+1]) <= 10:
                        result.append(
                            f"{row[2:len(row)]} {GeneratedImagePrompt._formatted_row(text[i+2])}".strip()
                        )
                    else:
                        result.append(
                            f"{row[2:len(row)]} {GeneratedImagePrompt._formatted_row(text[i+1])}".strip()
                        )
            except IndexError:
                pass
        logger.debug("finished, status=success")
        if not result:
            logger.debug("unsuccessful parsing\n%s" % text)
        return result

    @staticmethod
    def _formatted_row(row: str) -> str:
        """
        :param row: str
            example: "**hello world  "
        :return: str
            example: "hello wolrd"
        """
        return row.replace("*", "").replace("#", "").strip()
