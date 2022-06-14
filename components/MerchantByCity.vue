<template>
  <div>
    <v-col>
      <h4>Cantidad de mercantes Nº {{ merchants.length }}</h4>
    </v-col>
    <v-card class="overflow-y-auto" max-height="70vh">
      <v-col v-if="spiner">
        <p>cargando...</p>
      </v-col>
      <v-col v-for="(m, i) in merchants" :key="i">
        <p>{{ m.name }}</p>
        <v-btn  icon fab small @click="delet(i)" color="red">x</v-btn>
        <v-divider></v-divider>
      </v-col>
    </v-card>
  </div>
</template>

<script>

export default {
  computed: {
    merchants() {
      return this.$store.state.merchant.merchantTable
    },
    spiner() {
      return this.$store.state.merchant.spiner
    }
  },
  methods: {
    delet(i) {
      this.$store.dispatch('merchant/deletMerchant', i)
    }
  }
}
</script>

<style scoped>
::-webkit-scrollbar {
  width: 10px;
}
/* Track */
::-webkit-scrollbar-track {
  background: #0e0e0e;
}
/* Handle */
::-webkit-scrollbar-thumb {
  background: #888;
}
/* Handle on hover */
::-webkit-scrollbar-thumb:hover {
  background: #555;
}
</style>
