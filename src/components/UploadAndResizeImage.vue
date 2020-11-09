<template>
  <div>
    <v-file-input
      v-model="file"
      small-chips
      label="Imagem da Palestrante"
      accept="image/png, image/jpeg"
      truncate-length="30"
      outlined
      value="abc"
      dense
      @change="resizeImage"
    ></v-file-input>

    <div class="text-center">
      <v-img
        v-if="typeof file === 'string'"
        class="mx-auto"
        :src="file"
        :lazy-src="file"
        :max-width="maxSize"
      ></v-img>
      <canvas
        v-else
        class="mb-2"
        ref="canvas"
      />
    </div>
  </div>
</template>

<script>
import firebase from 'firebase/app';
import { uid } from 'uid';

export default {
  name: 'UploadAndResizeImage',
  props: ['input'],
  model: {
    prop: 'input',
    event: 'change',
  },
  data() {
    return {
      uid: null,
      file: this.input || null,
      downloadUrl: null,
      image: null,
      maxSize: 160,
    };
  },
  created() {
    this.uid = uid();
  },
  methods: {
    async uploadImage(file) {
      const id = this.uid;
      const storage = firebase.storage().ref();
      const imageRef = storage.child(`speakers/${id}.jpg`);
      await imageRef.put(file);
      const downloadUrl = await imageRef.getDownloadURL();
      this.downloadUrl = downloadUrl;
    },
    async deleteUploadedImage() {
      const id = this.uid;
      const storage = firebase.storage().ref();
      const imageRef = storage.child(`speakers/${id}.jpg`);
      await imageRef.delete();
      this.downloadUrl = null;
    },
    async saveBlob(image) {
      this.image = image;

      if (image) await this.uploadImage(image);
      else await this.deleteUploadedImage();

      const { downloadUrl } = this;
      this.$emit('change', downloadUrl);
    },
    deleteBlob() {
      const { canvas } = this.$refs;
      canvas.style.display = 'none';
      this.saveBlob(null);
    },
    resizeImage() {
      const { file } = this;
      if (!file) {
        this.deleteBlob();
        return;
      }

      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = (event) => {
        const img = new Image();
        img.src = event.target.result;
        img.onload = () => {
          const { maxSize } = this;
          const width = maxSize;
          const height = img.height * (maxSize / img.width);

          const { canvas } = this.$refs;
          canvas.style.display = 'inline';
          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext('2d');
          ctx.drawImage(img, 0, 0, width, height);

          ctx.canvas.toBlob((blob) => {
            const image = new File([blob], file.name, {
              type: 'image/jpeg',
              lastModified: Date.now(),
            });
            this.saveBlob(image);
            console.log(blob);
            console.log(image);
          }, 'image/jpeg', 1);
        };
      };
    },
  },
};
</script>
