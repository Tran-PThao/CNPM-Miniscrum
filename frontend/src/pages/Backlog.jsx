import { useState } from "react";

function Backlog() {
  const [projectId, setProjectId] = useState("");
  const [stories, setStories] = useState([]);
  const [message, setMessage] = useState("");

  const handleLoadStories = async () => {
    if (!projectId) {
      setMessage("Vui lòng nhập projectId");
      return;
    }

    try {
      const res = await fetch(
        `http://localhost:5000/api/project/${projectId}/userstories`,
      );
      const data = await res.json();

      if (!res.ok) {
        setMessage(data.error || "Không tải được backlog");
        return;
      }

      setStories(data);
      setMessage("");
    } catch (err) {
      setMessage("Không thể kết nối server");
    }
  };

  return (
    <div style={{ padding: 30 }}>
      <h2>Product Backlog</h2>

      <input
        type="text"
        placeholder="Nhập projectId"
        value={projectId}
        onChange={(e) => setProjectId(e.target.value)}
        style={{ padding: 8, width: 300, marginRight: 10 }}
      />
      <button onClick={handleLoadStories}>Xem backlog</button>

      {message && <p>{message}</p>}

      <div style={{ marginTop: 20 }}>
        {stories.length === 0 ? (
          <p>Chưa có User Story nào</p>
        ) : (
          stories.map((story) => (
            <div
              key={story.id}
              style={{
                border: "1px solid #ccc",
                padding: 12,
                marginBottom: 10,
                borderRadius: 8,
              }}
            >
              <h3>{story.title}</h3>
              <p>{story.description}</p>
              <p>Status: {story.status}</p>
              <p>Story Points: {story.storyPoints ?? "Chưa có"}</p>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default Backlog;
