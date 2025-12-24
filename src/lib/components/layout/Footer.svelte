<script>
  import { BadgeDollarSign, Code, FileText, Hammer, Lock } from "@lucide/svelte";
  import FooterLink from "./FooterLink.svelte";
</script>

<footer class="bg-base-200 mt-24 flex w-full justify-center py-5">
  <menu class="flex flex-wrap justify-evenly gap-x-10 gap-y-6 px-12 lg:max-w-5xl lg:px-0">
    <li>
      <FooterLink href="/terms">
        <FileText size={16} strokeWidth={2} />
        <span>terms</span>
      </FooterLink>
    </li>

    <li>
      <FooterLink href="/privacy">
        <Lock size={16} strokeWidth={2} />
        <span>privacy</span>
      </FooterLink>
    </li>

    <li>
      <FooterLink href="/rules">
        <Hammer size={16} strokeWidth={2} />
        <span>rules</span>
      </FooterLink>
    </li>

    <li>
      <FooterLink href="https://github.com/mxz7/nypsi-website" target="_blank">
        <Code size={16} strokeWidth={2} />
        <span>github</span>
      </FooterLink>
    </li>

    <li>
      <FooterLink href="/supporters">
        <BadgeDollarSign size={16} strokeWidth={2} />
        <span>supporters</span>
      </FooterLink>
    </li>
  </menu>
</footer>
