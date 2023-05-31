<div
  class="w-full h-full absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-30 bg-gray-900 overflow-hidden"
>
  <div class="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-50">
    <div class="lds-ring">
      <div />
      <div />
      <div />
      <div />
    </div>
  </div>
</div>

<style>
  .lds-ring {
    display: inline-block;
    position: relative;
    width: 80px;
    height: 80px;
  }
  .lds-ring div {
    box-sizing: border-box;
    display: block;
    position: absolute;
    width: 64px;
    height: 64px;
    margin: 8px;
    border: 8px solid rgb(239 68 68);
    border-radius: 50%;
    animation: lds-ring 1.2s cubic-bezier(0.5, 0, 0.5, 1) infinite;
    border-color: rgb(239 68 68) transparent transparent transparent;
  }
  .lds-ring div:nth-child(1) {
    animation-delay: -0.45s;
  }
  .lds-ring div:nth-child(2) {
    animation-delay: -0.3s;
  }
  .lds-ring div:nth-child(3) {
    animation-delay: -0.15s;
  }
  @keyframes lds-ring {
    0% {
      transform: rotate(0deg);
    }
    100% {
      transform: rotate(360deg);
    }
  }
</style>
