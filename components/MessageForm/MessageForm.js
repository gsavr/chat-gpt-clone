export const MessageForm = ({
  handleSubmit,
  loadingResponse,
  messageText,
  setMessagetext,
}) => {
  return (
    <div className="bg-[#283141] p-5">
      <form onSubmit={handleSubmit}>
        <fieldset className="flex gap-2" disabled={loadingResponse}>
          <textarea
            value={messageText}
            onChange={(e) => setMessagetext(e.target.value)}
            placeholder={
              !loadingResponse ? "Send a message" : "Waiting for response..."
            }
            className="w-full resize-none rounded-md bg-[#3C4655] p-2 text-white focus:outline-slate-400"
          />
          <button
            className="btn"
            type="submit"
            disabled={messageText.length === 0}
          >
            Send
          </button>
        </fieldset>
      </form>
    </div>
  );
};
