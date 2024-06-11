### Kanban Board Projesi Sonuç Yazısı

## Proje Özeti
Bu projede, ReactJS, NextJS, Tailwind CSS ve Firebase kullanarak bir Kanban Board uygulaması geliştirilmesi amaçlanmıştır. Uygulama, kullanıcılara görevlerini organize etmelerine ve yönetmelerine yardımcı olacak bir araçtır. Projenin ana bileşenleri arasında board, task listeleri ve kartlar bulunmaktadır. Kullanıcılar, farklı listelere kartlar ekleyebilir, bu kartları listeler arasında taşıyabilir, kartları güncelleyebilir ve silebilir , kartların sıralamasını ve renklerini değiştirebilirler, yeni liste oluşturabilir liste adını güncelleyebilir ve silebilirler .

## Kullanılan Teknolojiler

ReactJS: Kullanıcı arayüzünü dinamik ve modüler bir şekilde oluşturmak için kullanıldı.
NextJS: Sunucu tarafı işleme ve SEO dostu özellikler sağlamak için kullanıldı.
Tailwind CSS: Hızlı ve verimli bir şekilde stil oluşturmak için kullanıldı.
Firebase : Dataları saklamak için kullanıldı.

## Proje Yapısı ve Adımları

# Proje Kurulumu:

Yeni bir NextJS projesi oluşturuldu.
Gerekli bağımlılıklar (React DnD, Tailwind CSS, vb.) yüklendi.
Proje dosya yapısı oluşturuldu.

# Tasarımın Uygulanması:

Figma tasarım dosyasındaki görünüm referans alınarak Tailwind CSS kullanılarak stil dosyaları oluşturuldu.
Responsive tasarım ilkelerine dikkat edilerek arayüz geliştirildi.

# Board ve Listelerin Oluşturulması:

Bir card oluşturulduğunda, unique bir ID atanarak bu carda erişim sağlandı (örneğin, https://localhost/:id formatında).
Her boardda sabit 4 liste (Backlog, To Do, In Progress, Done) otomatik olarak oluşturuldu.

# Kartların Eklenmesi ve Yönetilmesi:

Kartlar listelere eklenebilir hale getirildi.
React DnD kütüphanesi kullanılarak kartların listeler arasında sürükle-bırak yöntemi ile taşınabilmesi sağlandı.
Aynı liste içindeki kartların sıralaması değiştirilebilir hale getirildi.

# Veri Yönetimi:

Kullanıcı tarafından yapılan tüm değişiklikler (kart ekleme, taşıma, sıralama) state yönetimi ile anlık olarak güncellendi.
Geliştirilen state yönetim sistemi ile her board ve listeye ait veriler yönetildi.
Verilerin kalıcı hale getirilmesi için firebase backend entegrasyonu yapıldı.

# Ek Özellikler ve Detaylar

Public Card Erişimi: Card ID'si olan herkesin bu card'a erişebilmesi sağlandı.
Kullanıcı Deneyimi: Kullanıcı dostu ve akıcı bir deneyim sağlamak için sürükle-bırak işlemleri optimize edildi.

# Notlar

Etiket ekleme özelliği proje gereksinimlerinde olmadığı için dahil edilmedi.
İleriye dönük olarak kullanıcı kimlik doğrulama ve yetkilendirme özellikleri eklenebilir.

# Sonuç
Bu proje, ReactJS, NextJS, Tailwind CSS ve Firebase kullanılarak başarılı bir şekilde tamamlanmıştır. Kullanıcılar, görevlerini organize etmek ve görevlerini yönetmek için işlevsel ve kullanıcı dostu bir Kanban Board uygulamasına sahip olmuştur. Proje sırasında elde ettiğim deneyim ve bilgiler, ileriye dönük geliştirmeler ve iyileştirmeler için sağlam bir kaynak oluşturmuştur.

# Proje Dosyaları ve Dokümantasyon:
Projenin kaynak kodları ve detaylı dokümantasyonu proje dosyaları içerisinde bulunmaktadır. Bu dokümantasyon, projeyi daha iyi anlamak ve ileride yapılacak geliştirmeler için rehberlik edecektir.