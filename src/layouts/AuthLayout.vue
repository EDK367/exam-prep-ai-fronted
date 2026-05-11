<template>
  <v-app>
    <v-main class="auth-layout">
      <v-container fluid class="fill-height">
        <v-row align="center" justify="center" class="fill-height">
          <v-col cols="12" sm="8" md="5" lg="4">
            <router-view />
          </v-col>
        </v-row>
      </v-container>
    </v-main>
  </v-app>
</template>