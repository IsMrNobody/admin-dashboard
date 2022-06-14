<template>
  <v-form v-model="valid">
    <v-container>
      <v-btn block @click="login" v-if="loger" color="orange" class="mb-4">Login</v-btn>
      <v-btn block @click="logOut" v-if="!loger">Salir</v-btn>
      <v-row class="mt-5">
        <v-col cols="12" sm="6">
          <v-select
            v-model="city"
            :items="cities"
            item-text="name"
            outlined
            :menu-props="{ bottom: true, offsetY: true }"
            label="Ciudad"
            @change="setCity(city)"
          ></v-select>
        </v-col>
        <v-col cols="12" sm="6">
          <v-select
            v-model="category"
            :items="categoris"
            outlined
            :menu-props="{ bottom: true, offsetY: true }"
            label="Categoria"
          ></v-select>
        </v-col>
        <v-col>
          <MapaM />
        </v-col>
        <v-col
          cols="12"
          md="4"
        >
          <v-text-field
            v-model="nameLocal"
            label="Nombre del Rest."
            @keyup="nameVal"
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
          md="3"
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

        <v-col sm="3">
          <v-switch
            v-model="delivery.active"
            label="Delivery"
            color="orange"
            hide-details
          ></v-switch>
        </v-col>

        <v-col sm="2">
          <v-switch
            v-model="top"
            label="top"
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
      category: '',
      city: '',
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
      cargando: false,
      loger: true,
      top: false,
      nameValue: ''
    }),
    computed: {
      categoris() {
        return this.$store.state.merchant.categoris
      },
      coordenadas() {
        return this.$store.state.mapa.coordinates
      },
      cities() {
        return this.$store.state.merchant.cities
      }
    },
    mounted() {
      this.$store.dispatch('merchant/getCities')
    },
    methods: {
        nameVal() {
          const val = this.nameLocal.toLowerCase()
          this.nameValue = val.split(" ").join("")
          console.log(this.nameValue)
        },
        setCity(name) {
          this.$store.dispatch('merchant/getMerchantbyCity', name)
        },
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
        },
        async login() {
          let user = Moralis.User.current()
          if (!user) {
          user = await Moralis.authenticate()
          this.loger = false
          } else {
            this.loger = false
          }
        },
        async logOut() {
          await Moralis.User.logOut()
          this.loger = true
        },
        async sendData() {
            if (!Moralis.User.current()) {
              this.login()
            }
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
                value: this.nameValue,
                address: this.direction,
                owner: this.nameOwner,
                category: this.category,
                delivery: this.delivery,
                city: this.city,
                top: this.top,
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
            // this.setCity()
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
