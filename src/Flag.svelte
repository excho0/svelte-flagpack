<script lang="ts">
  export let code: string = "NL";
  export let size: 's' | 'm' | 'l' = "m";
  export let gradient: '' | 'top-down' | 'real-linear' | 'real-circular' = '';
  export let hasBorder: boolean = true;
  export let hasDropShadow: boolean = false;
  export let hasBorderRadius: boolean = true;
  export let className: string | undefined;
  export { className as class };

  const lower = (q: string): string => q.toLowerCase();
  $: gradient = lower(gradient) as '' | 'top-down' | 'real-linear' | 'real-circular';
  $: size = lower(size) as 's' | 'm' | 'l';

  let Flag: string | undefined;

  async function importFlag(size: string, code: string): Promise<string> {
    try {
        const module = await import(`./flags/${size}/${code}.svg`);
        Flag = module.default;
        console.log(`Imported flag for ${code} size ${size}:`, Flag);
        return Flag ?? ''; // Ensure a string is always returned
    } catch (error) {
        console.error(`Error importing flag SVG for ${code} of size ${size}:`, error);
        throw new Error(`Failed to import flag for ${code}`);
    }
}

</script>

<div class={`
  flag
  ${gradient}
  size-${size}
  ${hasBorder ? 'border' : ''}
  ${hasDropShadow ? 'drop-shadow' : ''}
  ${hasBorderRadius ? 'border-radius' : ''}
  ${className ? className.replace(/\s\s+/g, ' ').trim() : ''}
`}>

  {#await importFlag(size, code) then Flag}
    <img src="{Flag}" alt={`Flag of ${code}`} />
     {:catch error}
    <div class="error">Failed to load flag.</div>
  {/await}

</div>

<style lang="scss">
 @mixin before-styling {
  content: '';
  width: 100%;
  height: 100%;
  position: absolute;
  display: block;
  mix-blend-mode: overlay;
  box-sizing: border-box;
}

.flag {
  display: inline-block;
  overflow: hidden;
  position: relative;
  box-sizing: border-box;
  align-items: center;

  img {
    display: block;
    width: 100%;
    height: 100%;
    object-fit: cover;
  }

  &.size {
    &-s {
      width: 16px;
      height: 12px;

      &.drop-shadow {
        box-shadow: 0 0 1px 0.5px rgba(0,0,0,0.10);
      }

      &.border-radius {
        border-radius: 1px;

        &.border {
          &::before {
            border-radius: 1px;
          }
        }
      }
    }

    &-m {
      width: 20px;
      height: 15px;

      &.drop-shadow {
        box-shadow: 0 1px 2px 0 rgba(0,0,0,0.10);
      }

      &.border-radius {
        border-radius: 1.5px;

        &.border {
          &::before {
            border-radius: 1.5px;
          }
        }
      }
    }

    &-l {
      width: 32px;
      height: 24px;

      &.drop-shadow {
        box-shadow: 0 2px 3px 0 rgba(0,0,0,0.10);
      }

      &.border-radius {
        border-radius: 2px;

        &.border {
          &::before {
            border-radius: 2px;
          }
        }
      }
    }
  }

  &.border {
    &::before {
      @include before-styling();
      border: 1px solid rgba(0, 0, 0, .5);
      mix-blend-mode: overlay;
    }
  }

  &.top-down {
    &::before {
      @include before-styling();
      background-image: linear-gradient(0deg, rgba(0,0,0,0.30) 2%, rgba(255,255,255,0.70) 100%);
    }
  }

  &.real-linear {
    &::before {
      @include before-styling();
      background-image: linear-gradient(45deg, rgba(0,0,0,0.20) 0%, rgba(39,39,39,0.22) 11%, rgba(255,255,255,0.30) 27%, rgba(0,0,0,0.24) 41%, rgba(0,0,0,0.55) 52%, rgba(255,255,255,0.26) 63%, rgba(0,0,0,0.27) 74%, rgba(255,255,255,0.30) 100%);
    }
  }

  &.real-circular {
    &::before {
      @include before-styling();
      background: radial-gradient(50% 36%, rgba(255,255,255,0.30) 0%, rgba(0,0,0,0.24) 11%, rgba(0,0,0,0.55) 17%, rgba(255,255,255,0.26) 22%, rgba(0,0,0,0.17) 27%, rgba(255,255,255,0.28) 31%, rgba(255,255,255,0.00) 37%) center calc(50% - 8px) / 600% 600%,
                  radial-gradient(50% 123%, rgba(255,255,255,0.30) 25%, rgba(0,0,0,0.24) 48%, rgba(0,0,0,0.55) 61%, rgba(255,255,255,0.26) 72%, rgba(0,0,0,0.17) 80%, rgba(255,255,255,0.28) 88%, rgba(255,255,255,0.30) 100%) center calc(50% - 8px) / 600% 600%;
    }
  }

}
</style>
