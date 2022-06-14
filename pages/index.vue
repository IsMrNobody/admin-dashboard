<template>
  <div class="text-center">
    <v-row>
      <v-col sm="8" cols>
        <h3>Crear Mercante</h3>
        <v-card>
          <MerchantForm />
        </v-card>
      </v-col>
      <v-col sm="4" cols>
        <MerchantByCity />
      </v-col>
    </v-row>
  </div>
</template>

<script>
import MerchantByCity from '@/components/MerchantByCity'
import MerchantForm from '@/components/MerchantForm'

export default {
  components: {
    MerchantForm,
    MerchantByCity
  }
}
</script>

