<template>
  <div class="slidev-layout socials">
    <div class="socials-photo">
      <img :src="photoUrl" alt="" />
    </div>
    <h1 class="socials-title">Our Socials</h1>
    <div class="socials-grid">
      <a class="social-item" href="https://instagram.com/itenium" target="_blank">
        <img src="https://cdn.simpleicons.org/instagram/E4405F" class="social-icon" />
        <span>@itenium</span>
      </a>
      <a class="social-item" href="https://x.com/itenium_be" target="_blank">
        <img src="https://cdn.simpleicons.org/x/ffffff" class="social-icon" />
        <span>@itenium_be</span>
      </a>
      <a class="social-item" href="https://linkedin.com/company/itenium" target="_blank">
        <svg class="social-icon" viewBox="0 0 24 24" fill="white"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>
        <span>itenium</span>
      </a>
      <a class="social-item" href="https://itenium.be" target="_blank">
        <img :src="faviconUrl" class="social-icon" />
        <span>itenium.be</span>
      </a>
      <a class="social-item" href="https://youtube.com/@itenium" target="_blank">
        <img src="https://cdn.simpleicons.org/youtube/FF0000" class="social-icon" />
        <span>@itenium</span>
      </a>
      <a class="social-item" href="https://github.com/itenium-be" target="_blank">
        <img src="https://cdn.simpleicons.org/github/ffffff" class="social-icon" />
        <span>itenium-be</span>
      </a>
    </div>
    <div class="socials-qr" v-if="$frontmatter?.qr">
      <QRCode :url="$frontmatter.qr" />
    </div>
  </div>
</template>

<script setup>
const faviconUrl = new URL('../assets/favicon-white.png', import.meta.url).href
const photoUrl = new URL('../assets/socials-photo.png', import.meta.url).href
</script>

<style scoped>
.socials {
  position: relative;
  height: 100%;
  background: #E78200;
  color: white;
  display: flex;
  flex-direction: column;
  padding: 3rem 4rem;
}

.socials-title {
  font-size: 2.4rem;
  color: #fff;
  margin-bottom: 2.5rem;
}

.socials-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 2rem 3rem;
  flex: 1;
}

.social-item {
  display: flex;
  align-items: center;
  gap: 1rem;
  text-decoration: none;
  color: white;
  font-size: 1.3rem;
}

.social-icon {
  width: 48px;
  height: 48px;
  object-fit: contain;
}

.socials-photo {
  position: absolute;
  top: 1.5rem;
  right: 3rem;
  width: 160px;
  height: 160px;
}
.socials-photo img {
  width: 100%;
  height: 100%;
  border-radius: 50%;
  border: 4px solid #fff;
  object-fit: cover;
}

.socials-qr {
  position: absolute;
  bottom: 2rem;
  right: 4rem;
  width: 120px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
}

.qr-label {
  font-size: 0.8rem;
  opacity: 0.7;
}

</style>
