export default function FAB({ onClick }) {
  return (
    <button
      onClick={onClick}
      className="fixed bottom-8 right-8 w-14 h-14 bg-primary text-on-primary rounded-2xl flex items-center justify-center shadow-2xl hover:scale-110 active:scale-95 transition-all z-50"
      title="Add Task"
    >
      <span className="material-symbols-outlined text-3xl">add_task</span>
    </button>
  );
}
