<script lang="ts" setup>
definePageMeta({
  pageTransition: {
    name: "slide-fade",
    mode: "out-in",
  },
});
</script>

<template>
  <div class="page-content">
    <section class="grid sm:grid-cols-2 gap-4">
      <div class="w-full flex flex-col items-start justify-start gap-4 sm:p-4">
        <h2 class="page-title mb-4">Home page</h2>

        <p>
          Lorem ipsum dolor sit amet consectetur, adipisicing elit. Dolor, omnis
          perferendis! Excepturi nisi, qui error fugiat iusto eaque ea eum non
          neque hic illum velit nostrum deleniti maiores adipisci cupiditate?
        </p>
        <p>
          Lorem ipsum dolor sit amet, consectetur adipisicing elit. Sit vel ab
          dolor molestiae maiores earum amet eaque facere. Dolore repellendus
          delectus cupiditate tenetur excepturi quisquam blanditiis illum enim
          temporibus harum, perspiciatis quos et expedita ullam, aliquam
          suscipit nulla nemo? Dicta excepturi doloremque pariatur consectetur
          perspiciatis laudantium dolorem, iure tempora enim corrupti quo
          assumenda iusto ratione iste aspernatur quam? Nihil, iusto.
        </p>
        <p>
          Lorem ipsum dolor sit, amet consectetur adipisicing elit. Dolor id,
          temporibus soluta, eligendi et laborum sint amet quibusdam doloremque
          porro molestiae ullam magni est eos quis earum esse ipsam, quam in
          nobis molestias nam ducimus. Voluptas hic, eum sed aperiam maxime et
          rem rerum aliquid!
        </p>
      </div>

      <div class="flex flex-col items-center justify-center">
        <div
          class="sm:w-3/4 w-full flex flex-col items-start justify-center gap-8"
        >
          <img
            src="https://cdn.pixabay.com/photo/2016/11/19/14/00/code-1839406__480.jpg"
            alt="Teste"
            class="w-full rounded-md"
          />

          <button class="btn btn-secondary btn-sm">Read more...</button>
        </div>
      </div>
    </section>
  </div>
</template>
