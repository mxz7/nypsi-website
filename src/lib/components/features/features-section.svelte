<script lang="ts">
  import { type IconProps } from "@lucide/svelte";
  import { onMount, type Component } from "svelte";

  interface Props {
    title: string;
    list: string[];
    image: string;
    Icon: Component<IconProps, {}, "">;
    flipped: boolean;
  }

  let { title, list, image, Icon, flipped }: Props = $props();

  let section: HTMLElement;

  onMount(() => {
    section.classList.add("animate-on-scroll");
    section.classList.add("animate-on-scroll-transition");

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((el) => {
          if (el.isIntersecting && el.target.id === `feature-${title}`) {
            section.classList.add("animate-visible");
            observer.unobserve(el.target);
          }
        });
      },
      { threshold: 0.4 },
    );

    observer.observe(section);
  });
</script>

<section class="{flipped ? '' : 'bg-base-200'} w-full" id="feature-{title}" bind:this={section}>
  <div class="mx-auto w-full py-28 lg:max-w-5xl">
    <div class="grid w-full grid-cols-1 px-3 lg:grid-cols-2 lg:px-0">
      <div class="flex flex-col justify-center gap-12">
        <h2
          class="flex w-full items-center justify-center gap-4 text-3xl font-bold text-white md:text-5xl lg:-mt-8 lg:justify-start"
        >
          <div class="bg-base-300 rounded-lg p-3">
            <Icon class="text-primary" size={32} strokeWidth={2.5} />
          </div>
          <span>{title}</span>
        </h2>
        <ul class="flex w-full flex-col justify-center gap-2 md:gap-3 md:text-lg">
          {#each list as item}
            <li>{@html item}</li>
          {/each}
        </ul>
      </div>
      <div class="pt-0 {flipped ? 'lg:-order-1 lg:pr-12' : 'lg:pl-12'}">
        <picture>
          <source srcset="https://cdn.nypsi.xyz/static/features/{image}.avif" type="image/avif" />
          <img
            src="https://cdn.nypsi.xyz/static/features/{image}.webp"
            alt="networth command"
            class="h-auto max-h-full w-auto max-w-full rounded-lg object-contain"
            loading="lazy"
            decoding="async"
          />
        </picture>
      </div>
    </div>
  </div>
</section>

<style>
  :global(.animate-on-scroll h2, .animate-on-scroll ul, .animate-on-scroll img) {
    opacity: 0;
    transform: translateY(45px);
  }

  :global(
    .animate-on-scroll-transition h2,
    .animate-on-scroll-transition ul,
    .animate-on-scroll-transition img
  ) {
    transition:
      opacity 0.5s ease-out,
      transform 0.5s ease-out;
  }

  :global(
    .animate-on-scroll.animate-visible h2,
    .animate-on-scroll.animate-visible ul,
    .animate-on-scroll.animate-visible img
  ) {
    opacity: 1;
    transform: translateX(0);
  }
</style>
