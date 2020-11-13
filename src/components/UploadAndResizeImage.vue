<template>
  <div v-cloak @drop.prevent="addDropFile" @dragover.prevent>
    <v-file-input
      v-model="file"
      small-chips
      label="Imagem da Palestrante"
      accept="image/png, image/jpeg"
      truncate-length="30"
      outlined
      dense
      @change="resizeImage"
    ></v-file-input>

    <div class="text-center">
      <v-progress-circular
        v-if="isUploading"
        class="mt-4"
        color="primary"
        :size="70"
        :width="7"
        indeterminate
      />
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
      isUploading: false,
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
    addDropFile(e) {
      // eslint-disable-next-line prefer-destructuring
      this.file = e.dataTransfer.files[0];
      this.resizeImage();
    },
    async uploadImage(file) {
      this.isUploading = true;

      const id = this.uid;
      const storage = firebase.storage().ref();
      const imageRef = storage.child(`speakers/${id}.jpg`);
      await imageRef.put(file);
      const downloadUrl = await imageRef.getDownloadURL();
      this.downloadUrl = downloadUrl;

      this.isUploading = false;
      const { canvas } = this.$refs;
      canvas.style.display = 'inline';
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
      this.saveBlob(null);
    },
    resizeImage() {
      const { canvas } = this.$refs;
      canvas.style.display = 'none';

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
          }, 'image/jpeg', 1);
        };
      };
    },
  },
};
</script>
