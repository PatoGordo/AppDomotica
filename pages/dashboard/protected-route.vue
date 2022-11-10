<script lang="ts" setup>
import { api } from "~~/service/api";
import { useLoading } from "~~/store/loading";

const loading = useLoading();
const router = useRouter();

const content = ref("");

async function getProtectedData() {
  loading.open();
  loading.hint = "Loading content....";

  try {
    const res = await api.get("/protected", {
      headers: {
        authorization: useToken(),
      },
    });

    content.value = res.data.result;
    loading.close();
  } catch (error) {
    useAxiosError(error, () => {
      loading.close();
      router.go(-1);
    });
  }
}

onMounted(async () => {
  await getProtectedData();
});

definePageMeta({
  middleware: "admin-and-editor-only",
  pageTransition: {
    name: "slide-fade",
    mode: "out-in",
  },
});
</script>

<template>
  <div class="page-content">
    <h2>Protected route!</h2>

    <p>the bold content below come from server</p>

    <p>
      <strong>{{ content }}</strong>
    </p>
  </div>
</template>
