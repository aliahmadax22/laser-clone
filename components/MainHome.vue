<template>
  <div class="w-full lg:px-20">
    <div id="upload-mode">
      <div id="upload-mode-left-side">
        <template v-if="selectedProduct">
          <ProductStandard :selected-product="selectedProduct" />
        </template>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import ProductStandard from "./artwork-upload-mode/ProductStandard.vue";

import type { Product } from "~/types/cart.types";
const selectedProduct: Product = {
  id: "17f3092a-2d0e-46b8-a5f7-3dbf70b4662c",
  projectName: "",
  designer: "test",
  printRun: 500,
  productImage: "http://localhost:3000/img/product/visitenkarten.jpg",
  productGroupName: "Visitenkarten",
  productDisplayName:
    "Visitenkarten, spitze Ecken, 85 x 55 mm quer, 2 Seiten, 300 g/m² Bilderdruckpapier matt FSC®",
  deliveryDate: "14.05.2024",
  artworkData: {
    type: "initial",
    productInfo: {
      dpi: 120,
      sides: 1,
      width_px: 1280,
      width_mm: 150,
      height_px: 1080,
      height_mm: 150,
      bleed_mm: 5,
    },
    manualUploadArtwork: {
      isActive: true,
      status: "started",
      files: [
        {
          fileName: "file1.jpg",
          fileUrl:
            "http://localhost:3000/img/artwork-upload/bc-85x55-sample.jpg",
          thumbUrl:
            "http://localhost:3000/img/artwork-upload/bc-85x55-sample.jpg",
          sort: 1,
          settings: {
            perforationLines: [
              {
                id: "line1",
                startX: 100,
                startY: 150,
                endX: 300,
                endY: 150,
                thickness: 2,
                dashArray: [5, 5],
                color: "#000000",
              },
            ],
          },
        },
        {
          fileName: "file2.jpg",
          fileUrl:
            "http://localhost:3000/img/artwork-upload/bc-85x55-sample.jpg",
          thumbUrl:
            "http://localhost:3000/img/artwork-upload/bc-85x55-sample.jpg",
          sort: 2,
        },
      ],
    },
    designStudioArtwork: {
      isActive: false,
      status: "initial",
    },
  },
  propertyConfiguration: [
    {
      propertyId: 75,
      value: 1643,
    },
    {
      propertyId: 44,
      value: 500,
    },
    {
      propertyId: 9,
      value: 35,
    },
    {
      propertyId: 10,
      value: 121,
    },
    {
      propertyId: 7,
      value: 78,
    },
    {
      propertyId: 8,
      value: 1628,
    },
    {
      propertyId: 29,
      value: 252,
    },
    {
      propertyId: 35,
      value: 297,
    },
    {
      propertyId: 42,
      value: 0,
    },
    {
      propertyId: 43,
      value: 0,
    },
    {
      propertyId: 33,
      value: 0,
    },
    {
      propertyId: 102,
      value: 1055,
    },
    {
      propertyId: 2,
      value: 179,
    },
    {
      propertyId: 4,
      value: 211,
    },
    {
      propertyId: 5,
      value: 203,
    },
    {
      propertyId: 164,
      value: 1644,
    },
    {
      propertyId: 53,
      value: 595,
    },
    {
      propertyId: 3,
      value: 0,
    },
    {
      propertyId: 27,
      value: 188,
    },
    {
      propertyId: 28,
      value: 191,
    },
  ],
  productDisplay: [
    {
      id: 75,
      resourceId: 1531,
      isRange: false,
      propertyValue: {
        id: 1643,
        resourceId: 9886,
      },
    },
    {
      id: 44,
      resourceId: 3,
      isRange: true,
      propertyValue: {
        id: 500,
        resourceId: 1107,
      },
    },
    {
      id: 9,
      resourceId: 524,
      isRange: false,
      propertyValue: {
        id: 35,
        resourceId: 344,
      },
    },
    {
      id: 10,
      resourceId: 525,
      isRange: false,
      propertyValue: {
        id: 121,
        resourceId: 351,
      },
    },
    {
      id: 7,
      resourceId: 523,
      isRange: false,
      propertyValue: {
        id: 76,
        resourceId: 300,
      },
    },
    {
      id: 8,
      resourceId: 526,
      isRange: false,
      propertyValue: {
        id: 1628,
        resourceId: 9869,
      },
    },
    {
      id: 99,
      resourceId: 4911,
      isRange: false,
      propertyValue: null,
    },
    {
      id: 29,
      resourceId: 765,
      isRange: false,
      propertyValue: {
        id: 252,
        resourceId: 370,
      },
    },
    {
      id: 30,
      resourceId: 766,
      containsImages: false,
      isRange: false,
      propertyValue: null,
      range: null,
    },
  ],
  priceDetails: {
    vatRate: 19,
    vat: 2.03,
    discount: 0,
    net: 10.68,
    gross: 12.71,
  },
  deliveryDistribution: [
    {
      printRun: 250,
      deliveryAddress: {
        addressId: "17f3092a-2d0e-46b8-a5f7-3dbf70b4662c",
        customerId: "c040a273-eb9b-4b9d-83a9-07f115bff58a",
        salutation: 110,
        firstName: "Michael",
        lastName: "Zink",
        company: "Prima Klima Reisen GmbH",
        street: "Ordensmeisterstr. 40",
        zip: "12099",
        city: "Berlin",
        countryCode: "DE",
        phone: "03068409839",
        email: "m.zink_at_primaklimareisen.de@saxoprint24.de",
        isMainAddress: true,
        salutationId: 1,
        phoneNumber: "test",
        furtherAddress: "xxx",
        invoiceAddressType: 1,
        deliveryAddressType: 1,
      },
    },
    {
      printRun: 250,
      deliveryAddress: {
        addressId: "17f3092a-2d0e-46b8-a5f7-3dbf70b4662c",
        customerId: "c040a273-eb9b-4b9d-83a9-07f115bff58a",
        salutation: 110,
        firstName: "Michael",
        lastName: "Zink",
        company: "Prima Klima Reisen GmbH",
        street: "Ordensmeisterstr. 40",
        zip: "12099",
        city: "Berlin",
        countryCode: "DE",
        phone: "03068409839",
        email: "m.zink_at_primaklimareisen.de@saxoprint24.de",
        isMainAddress: false,
        salutationId: 1,
        phoneNumber: "test",
        furtherAddress: "xxx",
        invoiceAddressType: 1,
        deliveryAddressType: 1,
      },
    },
  ],
};
</script>

<style lang="scss" scoped>
@import "@/assets/variables.scss";
</style>
