<?php
class JSLikeHTMLElement extends DOMElement
{
	/**
	* Used for setting innerHTML like it's done in JavaScript:
	* @code
	* $div->innerHTML = '<h2>Chapter 2</h2><p>The story begins...</p>';
	* @endcode
	*/
	public function __set($name, $value) {
		if ($name == 'innerHTML') {
			// first, empty the element
			for ($x=$this->childNodes->length-1; $x>=0; $x--) {
				$this->removeChild($this->childNodes->item($x));
			}
			// $value holds our new inner HTML
			if ($value != '') {
				$f = $this->ownerDocument->createDocumentFragment();
				// appendXML() expects well-formed markup (XHTML)
				$result = @$f->appendXML($value); // @ to suppress PHP warnings
				if ($result) {
					if ($f->hasChildNodes()) $this->appendChild($f);
				} else {
					// $value is probably ill-formed
					$f = new DOMDocument();
					$value = mb_convert_encoding($value, 'HTML-ENTITIES', 'UTF-8');
					// Using <htmlfragment> will generate a warning, but so will bad HTML
					// (and by this point, bad HTML is what we've got).
					// We use it (and suppress the warning) because an HTML fragment will 
					// be wrapped around <html><body> tags which we don't really want to keep.
					// Note: despite the warning, if loadHTML succeeds it will return true.
					$result = @$f->loadHTML('<htmlfragment>'.$value.'</htmlfragment>');
					if ($result) {
						$import = $f->getElementsByTagName('htmlfragment')->item(0);
						foreach ($import->childNodes as $child) {
							$importedNode = $this->ownerDocument->importNode($child, true);
							$this->appendChild($importedNode);
						}
					} else {
						// oh well, we tried, we really did. :(
						// this element is now empty
					}
				}
			}
		} else {
			$trace = debug_backtrace();
			trigger_error('Undefined property via __set(): '.$name.' in '.$trace[0]['file'].' on line '.$trace[0]['line'], E_USER_NOTICE);
		}
	}

	/**
	* Used for getting innerHTML like it's done in JavaScript:
	* @code
	* $string = $div->innerHTML;
	* @endcode
	*/	
	public function __get($name)
	{
		if ($name == 'innerHTML') {
			$inner = '';
			foreach ($this->childNodes as $child) {
				$inner .= $this->ownerDocument->saveXML($child);
			}
			return $inner;
		}

		$trace = debug_backtrace();
		trigger_error('Undefined property via __get(): '.$name.' in '.$trace[0]['file'].' on line '.$trace[0]['line'], E_USER_NOTICE);
		return null;
	}

	public function __toString()
	{
		return '['.$this->tagName.']';
	}
}

class File {
    private $filename;
    private $content;
    private $note;
    
    public function __construct() {
        $this->filename = isset($_POST['filename']) ? $_POST['filename'] : false;
        $this->content = isset($_POST['content']) ? $_POST['content'] : false;
        $this->note = isset($_POST['note']) ? $_POST['note'] : false;
        return;
    }
    public function savefile(){
        $d = new DOMDocument;
        $d->registerNodeClass('DOMElement', 'JSLikeHTMLElement');
        $d->loadHTML(file_get_contents($this->filename));
        $d->getElementsByTagName("body")->item(0)->innerHTML = $this->content;
        $xpath = new DomXpath($d);
        foreach ($xpath->query('//script[@type="application/ld+json"]') as $JSONnode) {
            $JSONnode->parentNode->removeChild($JSONnode);
        }
        
        $frag=$d->createDocumentFragment();
        $script=$d->createElement('script');
        $txt=$d->createTextNode("[".$this->note."]");

        $frag->appendChild( $script );
        $script->appendChild( $txt );

        $script->setAttribute("type", "application/ld+json");
        $d->getElementsByTagName("head")->item(0)->appendChild( $frag );
    
        file_put_contents($this->filename,$d->saveHTML());
        return;
    }
} 
    $file = new File();
    $file->savefile();
?>
