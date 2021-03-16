export default function turkishDateFormat(date) {
        const months = [ "Ocak", "Şubat", "Mart",
        "Nisan", "Mayıs", "Haziran", "Temmuz",
        "Ağustos", "Eylül", "Ekim",
        "Kasım", "Aralık"]
        let year = date.getFullYear();
        let month = date.getMonth();
        let day = date.getDate();

        let time = date.getHours() + " : " + date.getMinutes();
        
        const format = ""+ day + " " + months[month] + " " + year + " - " + time + "";
        return format;
    
}