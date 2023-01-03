const NoteForm = ({addNote, newNote, handeNoteChange}) => {
    <form onSubmit={addNote}>
        <input
            value={newNote}
            onChange={handeNoteChange}
        />
        <button type="submit">save</button>
    </form>
}

export default { NoteForm }