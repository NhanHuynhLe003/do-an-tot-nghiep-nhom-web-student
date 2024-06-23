//src/redux/actions.js

const setEditorContent = (payload) => ({
  type: "cvs/setEditorContent",
  payload,
});

const setIdEditor = (payload) => ({
  type: "cvs/setIdEditor",
  payload,
});
export { setEditorContent, setIdEditor };
