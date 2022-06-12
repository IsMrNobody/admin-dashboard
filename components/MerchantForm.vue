<template>
  <v-form v-model="valid">
    <v-container>
      <v-row>
        <v-btn v-if="loger" @click="login" block>Login</v-btn>
        <v-col
          cols="12"
          md="4"
        >
          <v-text-field
            v-model="nameLocal"
            label="Nombre del Rest."
            required
          ></v-text-field>
        </v-col>

        <v-col
          cols="12"
          md="4"
        >
          <v-text-field
            v-model="nameOwner.userId"
            label="Dueño"
            required
          ></v-text-field>
        </v-col>

        <v-col
          cols="12"
          md="4"
        >
          <v-text-field
            v-model="direction"
            label="Dirección"
          ></v-text-field>
        </v-col>

        <v-col
          cols="12"
          md="4"
        >
          <v-text-field
            v-model="phone"
            label="Telefono"
          ></v-text-field>
        </v-col>

        <v-col
          cols="12"
          md="4"
        >
          <v-text-field
            v-model="slogan"
            label="Slogan"
          ></v-text-field>
        </v-col>

        <v-row class="ma-2">
            <v-col
            cols=""
            sm="6"
            md="4"
            >
            <v-text-field
                label="Latitud"
                v-model="coordinateslat"
                outlined
                dense
            ></v-text-field>
            </v-col>
            <v-col
            cols=""
            sm="6"
            md="4"
            >
            <v-text-field
                label="Logitud"
                v-model="coordinateslong"
                outlined
                dense
            ></v-text-field>
            </v-col>
        </v-row>

        <v-col>
          <v-switch
            v-model="delivery.active"
            label="Delivery"
            color="orange"
            hide-details
          ></v-switch>
        </v-col>

        <v-col
          cols="12"
          md="4"
        >
          <v-file-input
            accept="image/*"
            label="Logo"
            :loading="cargando"
            @change="onFile"
            outlined
          ></v-file-input>
          <!-- <v-img width="300" :src="srcLogo"></v-img> -->
        </v-col>

        <v-col
          cols="12"
          md="4"
        >
          <v-file-input
            accept="image/*"
            label="Banner"
            :loading="cargando"
            @change="onFileBanner"
            outlined
          ></v-file-input>
          <!-- <v-img width="300" :src="srcBanner"></v-img> -->
        </v-col>

        <v-col cols="12">
          <v-select
            :items="cities"
            v-model="citis"
            outlined
            :menu-props="{ top: true, offsetY: true }"
            label="Ciudad"
          ></v-select>
        </v-col>

        <v-col cols="12">
          <v-select
            :items="categoris"
            v-model="category"
            outlined
            :menu-props="{ top: true, offsetY: true }"
            label="Categoria"
          ></v-select>
        </v-col>
        <v-card width="100%" class="pt-2" v-if="cargando">
          <!-- <p>Cargando....</p> -->
          <v-img width="100%" src="https://c.tenor.com/13VnwKt5qS0AAAAd/waiting.gif"></v-img>
        </v-card>
        <v-btn @click="sendData" color="green" :disabled="cargando" block>Enviar</v-btn>
      </v-row>
    </v-container>
  </v-form>
</template>

<script>
  const Moralis = require('moralis')
  const serverUrl = "https://hplfjqfbct7p.usemoralis.com:2053/server"
  const appId = "KtP2UEvFGJ2HAEC3xEJIsWuNygLzcKXYhyI3fLxU"
  const masterKey = "vskSPcnHZF26OBpum7buzuXo1zrjx7tIRXTXXqIX"
  Moralis.start({serverUrl, appId, masterKey})

  export default {
    data: () => ({
      delivery: {
          active: false
      },
      slogan: '',
      categoris: ['criolla', 'rapida', 'sushi'],
      category: '',
      cities: ['anaco', 'tigre', 'barcelona'],
      citis: '',
      valid: false,
      coordinateslat: '',
      coordinateslong: '',
      direction: '',
      phone: '',
      nameOwner: {
        userId: '',
        firtName: ''
      },
      nameLocal: '',
      fileBanner: '',
      fileLogo: '',
      srcBanner: '',
      srcLogo: '',
      cargando: false,
      loger: true
    }),
    created() {
      this.login()
    },
    methods: {
        onFile(event) {
            this.fileLogo = event
            // console.log(this.fileLogo)
            // const fileReader = new FileReader()
            // fileReader.addEventListener('load', () => {
            //     this.srcLogo = fileReader.resultç
            // })
            // fileReader.readAsDataURL(this.fileLogo)
        },
        onFileBanner(event) {
            this.fileBanner = event
            // const fileReader = new FileReader()
            // fileReader.addEventListener('load', () => {
            //     this.srcBanner = fileReader.result
            // })
            // fileReader.readAsDataURL(this.fileBanner)
        },
        async login() {
          let user = Moralis.User.current()
          if (!user) {
          user = await Moralis.authenticate()
          this.loger = false
          }
          console.log("logged in user:", user)
        },
        async sendData() {
            this.cargando = true
            const img = this.fileLogo
            const file = new Moralis.File('merchantLogo.jpg', img)
            const ban = this.fileBanner
            const fileB = new Moralis.File('merchantBanner.jpg', ban)
            await file.saveIPFS()
            await fileB.saveIPFS()
            const enlaceImg = file.ipfs()
            const enlaceBan = fileB.ipfs()
            // console.log(file.hash())
            const data = {
                name: this.nameLocal,
                value: this.nameLocal,
                address: this.direction,
                owner: this.nameOwner,
                category: this.category,
                delivery: this.delivery,
                city: this.citis,
                products: [],
                slogan: this.slogan,
                paymentMethods: [],
                reviews: [],
                coordinates: [this.coordinateslat, this.coordinateslong],
                phone: this.phone,
                logo: enlaceImg,
                banner: enlaceBan
            }
            console.log(data)
            this.$store.dispatch('merchant/sendMerchant', data)
            this.cargando = false
            this.reset()
            // return file.ipfs()
        },
        reset() {
          this.nameLocal = ''
          this.nameLocal = ''
          this.direction = ''
          this.nameOwner = {
            userId: ''
          }
          this.delivery = {
            active: false
          }
          this.category = ''
          this.citis = ''
          this.coordinateslat = ''
          this.coordinateslong = ''
          this.phone = ''
          this.slogan = ''
          this.srcBanner = ''
          this.srcLogo = ''
          this.fileBanner = ''
          this.fileLogo = ''
        }
    }
  }
</script>
