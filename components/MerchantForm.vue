<template>
  <v-form v-model="valid">
    <v-container>
      <v-row>
        <v-btn block @click="login" class="mb-4">Login</v-btn>
        <v-btn block @click="logOut">Salir</v-btn>
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
            outlined
            @change="onFile"
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
            outlined
            @change="onFileBanner"
          ></v-file-input>
          <!-- <v-img width="300" :src="srcBanner"></v-img> -->
        </v-col>

        <v-col cols="12">
          <v-select
            v-model="citis"
            :items="cities"
            outlined
            :menu-props="{ top: true, offsetY: true }"
            label="Ciudad"
          ></v-select>
        </v-col>

        <v-col>
          <MapaM />
        </v-col>

        <v-col cols="12">
          <v-select
            v-model="category"
            :items="categoris"
            outlined
            :menu-props="{ top: true, offsetY: true }"
            label="Categoria"
          ></v-select>
        </v-col>
        <v-card v-if="cargando" width="100%" class="pt-2">
          <!-- <p>Cargando....</p> -->
          <v-img width="100%" src="https://c.tenor.com/13VnwKt5qS0AAAAd/waiting.gif"></v-img>
        </v-card>
        <v-btn block color="green" :disabled="cargando" @click="sendData">Enviar</v-btn>
      </v-row>
    </v-container>
  </v-form>
</template>

<script>
  import MapaM from '@/components/MapaM'
  const Moralis = require('moralis')
  const serverUrl = "https://hplfjqfbct7p.usemoralis.com:2053/server"
  const appId = "KtP2UEvFGJ2HAEC3xEJIsWuNygLzcKXYhyI3fLxU"
  const masterKey = "vskSPcnHZF26OBpum7buzuXo1zrjx7tIRXTXXqIX"
  Moralis.start({serverUrl, appId, masterKey})

  export default {
    components: {
      MapaM
    },
    data: () => ({
      delivery: {
          active: false
      },
      slogan: '',
      categoris: ['criolla', 'rapida', 'sushi', 'hamburguesa', 'pizza', 'china', 'arabe'],
      category: '',
      cities: ['anaco', 'tigre', 'barcelona'],
      citis: '',
      valid: false,
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
    computed: {
      coordenadas() {
        return this.$store.state.mapa.coordinates
      }
    },
    created() {
      // const user = Moralis.User.current()
      // if (user) {
      //   this.loger = false
      // }
      // this.logOut()
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
          // console.log("logged in user:", user)
        },
        async logOut() {
          await Moralis.User.logOut()
          // console.log('deslogueado')
          this.loger = true
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
                coordinates: this.coordenadas,
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
