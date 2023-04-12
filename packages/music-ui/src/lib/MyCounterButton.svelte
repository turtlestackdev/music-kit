<script lang="ts">
  let count = 0;

  function handleClick() {
    count += 1;
  }
</script>

<button on:click="{handleClick}" class="text-amber-500 bg-gray-600 p-2">
  clickers: {count}
</button>
