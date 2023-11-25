import io
import base64
from PIL import Image
import matplotlib.pyplot as plt
from skimage.segmentation import mark_boundaries
from tensorflow.keras.models import load_model
from PIL import Image
import numpy as np
from lime import lime_image
model=load_model('model.h5')
def get_xai_url(image_url):
        image_url=str(image_url)   
        _, encoded_data = image_url.split(",", 1)
        decoded_data = base64.b64decode(encoded_data)
        #img_class=img_class.reshape((1,224,224,3))
        img = Image.open(io.BytesIO(decoded_data)).resize((224,224))
        img_array = np.array(img)
        explainer = lime_image.LimeImageExplainer(random_state=42)
        explanation = explainer.explain_instance(img_array,model.predict)
        image, mask = explanation.get_image_and_mask(
                model.predict(
                    img_array.reshape((1,224,224,3))
                ).argmax(axis=1)[0],
                )
        fig, ax = plt.subplots()
        ax.imshow(mark_boundaries(image, mask))
        ax.axis('off')
        buffer = io.BytesIO()
        plt.savefig(buffer, format='png', bbox_inches='tight', pad_inches=0)
        buffer.seek(0)
        data = base64.b64encode(buffer.getvalue()).decode()
        data_url = f'data:image/png;base64,{data}'
        return data_url
if __name__=="__main__":
        
        with open ("image_data.txt",'rb') as f:
             image_url=f.read()
        res=get_xai_url(image_url)
        print(res)



