import type { FormEvent } from "react";
import "./api/client";
import { useDeleteMutation, useGetQuery, usePostMutation } from "./api/hooks";

export default function App() {
  // Mutations
  const createGist = usePostMutation("/gists");
  const removeGist = useDeleteMutation("/gists/{gist_id}");

  // Queries
  const gists = useGetQuery("/gists", { params: { query: { per_page: 5 } } });

  const handleCreate = (e: FormEvent) => {
    e.preventDefault();

    const onSuccess = () => gists.refetch();
    createGist.mutate(
      {
        body: {
          description: new Date().toISOString(),
          files: { "greeting.txt": { content: "hello, world" } },
        },
      },
      { onSuccess }
    );
  };

  const handleDelete = (id: string) => {
    if (!confirm("Are you sure?")) return;

    const onSuccess = () => gists.refetch();
    removeGist.mutate({ params: { path: { gist_id: id } } }, { onSuccess });
  };

  return (
    <>
      <h1>Gists</h1>
      <ul>
        {gists.data?.map((gist) => (
          <li key={gist.id}>
            <strong>{gist.description || "Untitled"}</strong>
            <small>{new Date(gist.created_at).toLocaleTimeString()}</small>
            <button onClick={() => handleDelete(gist.id)}>❌</button>
          </li>
        ))}
      </ul>

      <form onSubmit={handleCreate}>
        <button type="submit">Create Gist</button>
      </form>
    </>
  );
}
