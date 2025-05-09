<template>
  <div class="coffee-banner">
    <a href="https://buymeacoffee.com/allyship" target="_blank" class="coffee-button">
      <span class="coffee-icon">☕</span>
      <span class="coffee-text">Buy me a coffee</span>
    </a>
  </div>
</template>

<style scoped>
.coffee-banner {
  display: block;
  margin-top: 20px;
  text-align: center;
}

.coffee-button {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  background-color: #ffdd00;
  color: #000000;
  font-weight: 600;
  padding: 10px 16px;
  border-radius: 8px;
  text-decoration: none;
  transition: all 0.2s;
  border: 2px solid transparent;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
}

.coffee-button:hover {
  background-color: #ffd000;
  transform: translateY(2px);
  box-shadow: 0 3px 7px rgba(0, 0, 0, 0.15);
}

.coffee-icon {
  font-size: 1.2em;
  margin-right: 8px;
}

/* Right sidebar is typically hidden on smaller screens */
@media (max-width: 1280px) {
  .right-sidebar-banner {
    top: 60px;
    right: 12px;
  }
}

/* For mobile views */
@media (max-width: 768px) {
  .right-sidebar-banner {
    top: auto;
    bottom: 20px;
    right: 20px;
  }
  
  .coffee-button {
    padding: 6px 12px;
  }
}

@media (max-width: 640px) {
  .coffee-text {
    font-size: 14px;
  }
  
  .coffee-button {
    padding: 8px 12px;
  }
}
</style> 