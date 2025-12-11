import Banner from "@/components/cms/Banner"
import Content from "@/components/cms/Content"

const content = {
    bannerTitle: 'Terms & Conditions Technology Partner',
    updateDate: 'March 22, 2024',
    pageTitle: 'Terms & Conditions',
    content: '<p><strong>Disclaimers for Website and General Disclaimer</strong></p> <p><strong>Disclaimer :</strong></p> <p>This website alongwith all the contents are put up on an "as is" basis. You need to acknowledge and agree that using the website and content is completely at your own risk by accessing and using this very website.</p> <p>Neither we make any representations nor do we warranty regarding the websites and its contents, which includes, without limitation, no warranty, no representation –</p> <ol> <li>This website and its contents will be complete or timely</li> <li>Any content, also including without limitations, any data, software, information, product or service as contained in or else these are made available through these websites will hold the merchantable quality of befit a particular purpose</li> <li>The websites will operate without any interruptions or error-free</li> <li>The errors or defects in the websites will be corrected.</li> <li>The websites will be viruses free, and free from harmful components.</li> <li>The communications will be secured and not intercepted to and from these websites.</li> </ol> <p>We could receive an affiliate commission from the third party companies, as part of the training materials, or through recommendations on blog posts, or else by passing the comments or referrals on which you act upon then.</p> <p>The complete information published on our website is for information and education purposes. The information does not intend to provide any advice on accounting, investment, legal, or financial. You must refrain from providing such advice relying on the information.</p> <p>The information given here is intended only as the basis to enter into further discussion, study or research. No warranties are provided and we disclaim all liability for indirect, direct or any consequential loss coming up in connection with the content use of this website, or else any reliance by any organization or a person on these contents - whether in original or altered form.</p> <p>We are advising all the users to act wisely and seek professional advice independently.</p>'
}
const page = () => {
  return (
    <>
      <Banner data={content} />
      <Content data={content} />
    </>
  )
}

export default page
