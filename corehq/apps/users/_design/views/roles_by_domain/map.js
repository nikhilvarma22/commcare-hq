function (doc) {
    if (doc.doc_type === 'DomainUserRole') {
        emit(doc.domain, null);
    }
}