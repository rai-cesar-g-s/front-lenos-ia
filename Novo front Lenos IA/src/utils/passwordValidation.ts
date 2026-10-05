export const validatePassword = (password: string): string => {
    if (!password) return "Informe uma senha.";
    if (password.length < 8 || password.length > 20) return "A senha deve conter entre 8 e 20 caracteres.";
    return "";
};

export const validatePasswordConfirmation = (password: string, confirmation: string): string => {
    if (!confirmation) return "Confirme a sua senha.";
    if (confirmation !== password) return "As senhas não coincidem.";
    return "";
};
