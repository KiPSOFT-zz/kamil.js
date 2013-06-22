kamil.js
========

sınıf tabanlı javascript kod oluşturma kütüphanesi (node.js içindir)

kamil.js ile bir kaç komut yardımıyla üzerinde izleme yapabileceğiniz javascript kodları oluşturabilirsiniz.

yapı
========

TKamil = sınıf extend TBlock

TKamil.SaveToFile(FileName)

blok içerisinde oluşan veriyi dosyaya yazar.

TBlock = sınıf 

kütüphanenin ana sınıfıdır. base bir çok method ve özelliği barındırır.

TBlock.AddLine(name, left, right, before)

AddLine methodu blok içerisine bir komut satırı eklemek için kullanılır.
Örnek olarak console.log("naber") bir AddLine çıktısıdır.

name = her satır için kullanılacak tekil isimdir.

left ve right = TVariable, TCmd veya TBlock değeri alabilen parametrelerdir.
                Add methodunun dönüş değerine eşittir. kod içerisinde "=" (eşittir) işaretinin
                sol ve sağ tarafı olarak düşünülmelidir. bir eşitleme yoksa sadece sol parametre 
                doldurulacaktır.

before = istenilen satırdan kaç satır önceye ekleme yapılacağını belirtmek için kullanılır.

TBlock.Add(name, type, params)

Add methodu AddLine ile eklenecek satırlarda ki left ve right parametlerini oluşturmak için kullanılır.

name = her kısım için kullanılacak tekil isimdir.

type = TType sabitine denk bir değer olmalıdır.
      var TType = {
            "Var": 0,
	          "Func": 1,
	          "If": 2,
	          "For": 3,
	          "Else": 4,
	          "Cmd": 5
      };  

params = katar halinde veri işlenebilecek bir alandır. fonksiyonlarda fonkisyonların parametreleri, komutlarda ise 
        komutun parametrelerini teşkil eder. değişken tanımlarında var deneme = "bubirdeneme" ifadesinde ki 
        "bubirdeneme" sabitine denktir.

TBlock.Find(name, type)

verilen tipte verilen isme ait komudu getirir.

TBlock.FindLine(name)

verilen isme ait satırı döndürür.

TBlock.PrevLine()

aktif satırdan bir önceki satıra konumlanır.

TBlock.NextLine()

aktif satırdan bir sonraki satıra konumlanır.

TBlokc.GetCode()

bloğun kod çıktısını döndürür.

örnek bir kamil.js yapısı:


        var kml = new kamil.TKamil();  
	var blk = kml.Add("IndexYaz", kamil.TType.Func, "");	
	blk.AddLine("satir1", blk.Add("console.log", kamil.TType.Cmd, ["index html oluşturuluyor."]));	
	blk.AddLine("satir2", blk.Add("$", kamil.TType.Cmd, []), 
		blk.Add("cheerio.load", kamil.TType.Cmd, ["<html></html>"]));	
	blk.AddLine("satir3", blk.Add("$(\"html\").append", kamil.TType.Cmd, ["<head></head>"]));	
	console.log(kml.GetCode());	
  
  bu kodun çıktısı şu şekilde olacaktır;
  
  
  	function IndexYaz() {
    	  console.log("index.html oluşturuluyor.");
    	  $ = cheerio.load("<html></html>");
    	  $("html").append("<head></head>");
  	}
  
  
.  
  
