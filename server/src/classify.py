import sys
import base64
import io
from PIL import Image
import numpy as np
import pickle
from tensorflow.keras.models import load_model
model=load_model("C:/class/model.h5")


def get_class(image_url):     
        image_url=str(image_url)   
        _, encoded_data = image_url.split(",", 1)
        decoded_data = base64.b64decode(encoded_data)
        #img_class=img_class.reshape((1,224,224,3))
        img = Image.open(io.BytesIO(decoded_data)).resize((224,224))
        img_array = np.array(img)
        img_array=img_array.reshape((1,224,224,3))
        classes=['age_related_macular_degeneration', 'pathological_myopia', 'glaucoma', 'cataract']
        p=model.predict(img_array)
        return classes[p[0].argmax()]


if __name__ == "__main__":
    with open("C:/class/image_data.txt",'rb') as f:
        imageURL=f.read()
    result = get_class(imageURL)
    print(result) 
    with open("C:/class/image_data2.txt",'rb') as f:
        imageURL=f.read()
    result = get_class(imageURL)
    print(result) 

   