Địa chỉ cụ thể: ‘Đường 123’

Xã: ‘Nam Sơn’

Huyện: ‘Sóc Sơn’,

Thành phố: ‘Hà Nội’

Gửi đi nối chuỗi trả về như này để tôi post vào form trong backenc chỉ nhận theo format này trong 1 trường duy nhất : ‘Đường 123, Nam Sơn, Sóc Sơn, Hà Nội’

Dùng API tỉnh thành huyện xã việt nam

Và cả nhân viên và khách hàng nhận "address":: “Đường 123, Nam Sơn, Sóc Sơn, Hà Nội’’

Khách hàng bỏ quyền hạn đi tại tôi đã để mặc định trong api là chỉ khách hàng rồi khi post đường dẫn này

Đây là Get danh sách khánh hàng;

@http://localhost:8080/api/account/list-khach-hang

Nó sẽ trả về như này:

‘{

    "status": 200,

    "message": "Lấy user thành công",

    "data": [

        {

            "id": 15,

            "fullName": "Nguyễn Đăng Biển",

            "code": "USER_2",

            "email": "emaiao1@gmail.com",

            "password": "string",

            "phone": "0958168698",

            "address": "stringssssss",

            "googleId": "string",

            "imageAvatar": "https://thumbs.dreamstime.com/b/creative-illustration-default-avatar-profile-placeholder-isolated-background-art-design-grey-photo-blank-template-mockup-144857620.jpg",

            "idRole": {

                "id": 2,

                "code": "ROLE_2",

                "name": "Khách hàng"

            },

            "gender": **false**,

            "birthDate": "2004-12-10",

            "status": "IN_ACTIVE"

        }

    ]

}

’

Đây là khách hàng: ‘

**PUT****Cập nhật Copy**

**[Open request](https://desktop.postman.com/?desktopVersion=11.36.6&userId=42239351&teamId=0&region=us)**

http://localhost:8080/api/account/update/{{id}}

Add request description…﻿  
  

**Body**raw (json)

View More

json

{

  "fullName": "Nguyễn Quốc Trís",

  //email không được trùng trong db

  "email": "quoctrinamsons@gmail.com",

  "password": "string",

  //số điện thoại không được trùng trong db

  "phone": "0958168699",

  "address": "string",

  "googleId": "string",

  "imageAvatar": "string",

  "gender": true,

  "birthDate": "2004-12-10",

  "status": "ACTIVE"

}

**GET****Lấy theo id Copy**

**[Open request](https://desktop.postman.com/?desktopVersion=11.36.6&userId=42239351&teamId=0&region=us)**

http://localhost:8080/api/account/get/{{id}}

Add request description…﻿  
  

**GET****Lấy mỗi khách hàng về Copy**

**[Open request](https://desktop.postman.com/?desktopVersion=11.36.6&userId=42239351&teamId=0&region=us)**

http://localhost:8080/api/account/list-khach-hang

Add request description…﻿  
  

**POST****Đẩy lên Copy**

**[Open request](https://desktop.postman.com/?desktopVersion=11.36.6&userId=42239351&teamId=0&region=us)**

http://localhost:8080/api/account/add-

Add request description…﻿  
  

**Request Headers**

**accept**

*/*

**Content-Type**

application/json

**Body**raw (json)

View More

json

{

  "fullName": "Nguyễn Quốc Trí",

  //email không được trùng trong db

  "email": "quoctrinamson@gmail.com",

  "password": "string",

  //số điện thoại không được trùng trong db

  "phone": "0358168699",

  "address": "string",

  "googleId": "string",

  "imageAvatar": "string",

  "gender": true,

    "birthDate": "2004-12-10",

’

Đây là nhân viên :

## nhanvien

Add folder description…﻿

### 

PUTCập nhật

**[Open request](https://desktop.postman.com/?desktopVersion=11.36.6&userId=42239351&teamId=0&region=us)**

http://localhost:8080/api/account/update-nhan-vien/{{id}}

Add request description…﻿

**Body**raw (json)

View More

json

{

```
    
```

```
  
```

```
  
```

```
  
```

```
  
```

```
  
```

```
  
```

```
  
```

```
  
```

```
  
```

```
  
```

```
    
```

```
  
```

}

### 

POSTĐẩy lên

**[Open request](https://desktop.postman.com/?desktopVersion=11.36.6&userId=42239351&teamId=0&region=us)**

http://localhost:8080/api/account/add-nhan-vien

Add request description…﻿

**Request Headers**

**accept**

*/*

**Content-Type**

application/json

**Body**raw (json)

View More

json

{

```
    
```

```
  
```

```
  
```

```
  
```

```
  
```

```
  
```

```
  
```

```
  
```

```
  
```

```
  
```

```
  
```

```
    
```

```
  
```

}

### 

GETLấy tất cả về Copy

**[Open request](https://desktop.postman.com/?desktopVersion=11.36.6&userId=42239351&teamId=0&region=us)**

http://localhost:8080/api/account/list-nhan-vien

Nhân viên cũng bỏ form quyền hạn đi do tôi đã để mặc định chỗ này là cho nhân viên rồi và dùng

STATUS tôi nhân là chuỗi chứ không phải là enum và mặc định chỉ nhận ACTIVE VÀ IN_ACTIVE

Template dùng kiểu như này những sửa lại đi nhé và table thì dùng table shadcn đơn giản giản có nút chuyển switch chuyển trạng thái trên table và khi ấn vào thêm mới thì sang trang thêm mới và trên table có chỗ ‘Chức năng’ có nút button ấn là chuyển sang trang ‘update’ “const formSchema = z.**object**({

  fullName: z

    .**string**()

    .**min**(3, 'Họ và tên phải có ít nhất 3 ký tự')

    .**max**(50, 'Họ và tên không được quá 50 ký tự')

    .**regex**(/^_[\p{L}\s]_+$/u, 'Họ tên chỉ được chứa chữ cái và khoảng trắng'),

  gender: z.**enum**(['Nam', 'Nữ', 'Khác'], {

    required_error: 'Vui lòng chọn giới tính',

  }),

  email: z

    .**string**()

    .**email**('Email không hợp lệ')

    .**min**(5, 'Email phải có ít nhất 5 ký tự'),

  password: z.**string**().**default**("string"),

  phone: z

    .**string**()

    .**min**(10, 'Số điện thoại phải có ít nhất 10 số')

    .**max**(15, 'Số điện thoại không được quá 15 số')

    .**regex**(/^_[0-9+]_+$/, 'Số điện thoại chỉ được chứa số và dấu +'),

  address: z

    .**string**()

    .**min**(10, 'Địa chỉ phải có ít nhất 10 ký tự')

    .**max**(200, 'Địa chỉ không được quá 200 ký tự'),

  idRole: z.**enum**(['admin', 'staff', 'customer'], {

    required_error: 'Vui lòng chọn quyền hạn',

  }),

  birthDate: z.**string**().**refine**((date) => {

    if (!date) return false

    const birthDate = new **Date**(date)

    const today = new **Date**()

    let age = today.**getFullYear**() - birthDate.**getFullYear**()

    const monthDiff = today.**getMonth**() - birthDate.**getMonth**()

    if (

      monthDiff < 0 ||

      (monthDiff === 0 && today.**getDate**() < birthDate.**getDate**())

    ) {

      age--

    }

    return age >= 15

  }, 'Người dùng phải đủ 15 tuổi'),

  status: z.**string**().**default**("ACTIVE"),

  googleId: z.**string**().**default**("string"),

  imageAvatar: z.**string**().**default**("string"),

})

type FormData = z.infer<typeof formSchema>

const mapRoleToId = {

  admin: 1,

  staff: 3,

  customer: 2,

}

export default function **MyForm**() {

  const [accounts, setAccounts] = **useState**<TaiKhoan[]>([])

  const [isSubmitting, setIsSubmitting] = **useState**(false)

  const [isLoading, setIsLoading] = **useState**(true)

  const form = **useForm**<FormData>({

    resolver: **zodResolver**(formSchema),

    defaultValues: {

      status: "ACTIVE",

      password: "string",

      googleId: "string",

      imageAvatar: "https://thumbs.dreamstime.com/b/creative-illustration-default-avatar-profile-placeholder-isolated-background-art-design-grey-photo-blank-template-mockup-144857620.jpg",

    }

  })

  const **fetchAccounts** = async () => {

    try {

      const response = await axios.**get**('http://localhost:8080/api/account/list')

      if (response.status === 200) {

        const accountsData = response.data.data.**map**((acc: any) => {

          const status = acc.status === "ACTIVE" ? ("ACTIVE" as const) : ("IN_ACTIVE" as const)

          return {

            ...acc,

            status

          } satisfies TaiKhoan

        }) as TaiKhoan[]

        **setAccounts**(accountsData)

      }

    } catch (error) {

      console.**error**('Error fetching accounts:', error)

      toast.**error**('Không thể tải dữ liệu tài khoản.')

    } finally {

      **setIsLoading**(false)

    }

  }

  const **handleStatusChange** = async (account: TaiKhoan, newStatus: boolean) => {

    try {

      const response = await axios.**put**(

        `http://localhost:8080/api/account/update/${account.id}`,

        {

          fullName: account.fullName,

          email: account.email,

          password: "string",

          phone: account.phone,

          address: account.address,

          googleId: "string",

          imageAvatar: account.imageAvatar,

          idRole: account.idRole.id,

          gender: account.gender,

          birthDate: account.birthDate,

          status: newStatus ? "ACTIVE" : "IN_ACTIVE"

        }

      )

      if (response.status === 202) {

        toast.**success**('Đã cập nhật trạng thái tài khoản.')

        // Update the local account data immediately

        const status = newStatus ? "ACTIVE" as const : "IN_ACTIVE" as const

        const updatedAccounts = accounts.**map**(acc => {

          if (acc.id === account.id) {

            return {

              ...acc,

              status

            }

          }

          return acc

        }) as TaiKhoan[]

        **setAccounts**(updatedAccounts)

        return true

      }

      toast.**error**('Không thể cập nhật trạng thái')

      return false

    } catch (error: any) {

      console.**error**('Status update error:', error)

      const errorMessage = error.response?.data?.message || 'Không thể cập nhật trạng thái'

      toast.**error**(errorMessage)

      return false

    }

  }

  **useEffect**(() => {

    **fetchAccounts**()

  }, [])

  async function **onSubmit**(values: FormData) {

    **setIsSubmitting**(true)

    try {

      const payload = {

        fullName: values.fullName,

        email: values.email,

        password: values.password,

        phone: values.phone,

        address: values.address,

        googleId: "string",

        imageAvatar: "https://thumbs.dreamstime.com/b/creative-illustration-default-avatar-profile-placeholder-isolated-background-art-design-grey-photo-blank-template-mockup-144857620.jpg",

        idRole: mapRoleToId[values.idRole],

        gender: values.gender === 'Nam',

        birthDate: values.birthDate,

        status: values.status

      }

      console.**log**('Sending payload:', payload)

      const response = await axios.**post**('http://localhost:8080/api/account/add', payload)

      console.**log**('Response:', response)

      if (response.status === 200 || response.status === 202) {

        toast.**success**('Đã tạo tài khoản mới.')

        form.**reset**({

          fullName: '',

          email: '',

          phone: '',

          address: '',

          gender: undefined,

          idRole: undefined,

          birthDate: undefined,

          status: "ACTIVE",

          password: "string",

          googleId: "string",

          imageAvatar: "string",

        })

        await **fetchAccounts**()

      } else {

        console.**error**('Unexpected response:', response)

        throw new **Error**(response.data?.message || 'Có lỗi xảy ra')

      }

    } catch (error: any) {

      console.**error**('Form submission error:', error)

      console.**error**('Error response:', error.response)

      const errorMessage = error.response?.data?.message

        ? `Lỗi: ${error.response.data.message}`

        : 'Không thể tạo tài khoản. Vui lòng thử lại.'

      toast.**error**(errorMessage)

    } finally {

      **setIsSubmitting**(false)

    }

  }

  return (

    <>

      <Form {...form}>

        <form

          onSubmit={form.**handleSubmit**(onSubmit)}

          className='mx-auto max-w-3xl space-y-8 py-10'

        >

          <div className='grid grid-cols-12 gap-4'>

            <div className='col-span-6'>

              <FormField

                control={form.control}

                name='fullName'

                render={({ field }) => (

                  <FormItem>

                    <FormLabel>Họ và tên</FormLabel>

                    <FormControl>

                      <Input

                        placeholder='VD: Nguyễn Văn A'

                        type='text'

                        {...field}

                      />

                    </FormControl>

                    <FormDescription>Nhập đẩy đủ họ và tên</FormDescription>

                    <FormMessage />

                  </FormItem>

                )}

              />

            </div>

            <div className='col-span-6'>

              <FormField

                control={form.control}

                name='gender'

                render={({ field }) => (

                  <FormItem>

                    <FormLabel>Giới tính</FormLabel>

                    <Select

                      onValueChange={field.onChange}

                      defaultValue={field.value}

                    >

                      <FormControl>

                        <SelectTrigger>

                          <SelectValue placeholder='Vui lòng chọn giới tính' />

                        </SelectTrigger>

                      </FormControl>

                      <SelectContent>

                        <SelectItem value='Nam'>Nam</SelectItem>

                        <SelectItem value='Nữ'>Nữ</SelectItem>

                        <SelectItem value='Khác'>Khác</SelectItem>

                      </SelectContent>

                    </Select>

                    <FormDescription>Vui lòng chọn giới tính</FormDescription>

                    <FormMessage />

                  </FormItem>

                )}

              />

            </div>

          </div>

          <div className='grid grid-cols-12 gap-4'>

            <div className='col-span-4'>

              <FormField

                control={form.control}

                name='email'

                render={({ field }) => (

                  <FormItem>

                    <FormLabel>Email</FormLabel>

                    <FormControl>

                      <Input

                        placeholder='nguyenvana@gmail.com'

                        type='email'

                        {...field}

                      />

                    </FormControl>

                    <FormMessage />

                  </FormItem>

                )}

              />

            </div>

            <div className='col-span-4'>

              <FormField

                control={form.control}

                name='phone'

                render={({ field }) => (

                  <FormItem>

                    <FormLabel>Số điện thoại</FormLabel>

                    <FormControl>

                      <Input

                        placeholder='0912345678'

                        type='string'

                        {...field}

                      />

                    </FormControl>

                    <FormMessage />

                  </FormItem>

                )}

              />

            </div>

            <div className='col-span-4'>

              <FormField

                control={form.control}

                name='birthDate'

                render={({ field }) => (

                  <FormItem>

                    <FormLabel>Ngày sinh</FormLabel>

                    <DatePicker

                      value={

                        field.value

                          ? (() => {

                              const [year, month, day] = field.value

                                .**split**('-')

                                .**map**(Number)

                              return new **CalendarDate**(year, month, day)

                            })()

                          : null

                      }

                      onChange={(date) => {

                        if (date) {

                          const formattedDate = `${date.year}-${**String**(

                            date.month

                          ).**padStart**(2, '0')}-${**String**(date.day).**padStart**(2, '0')}`

                          field.**onChange**(formattedDate)

                        } else {

                          field.**onChange**(null)

                        }

                      }}

                    >

                      <div className='flex'>

                        <Group className='w-full'>

                          <DateInput className='pe-9' />

                        </Group>

                        <Buttons className='data-focus-visible:border-ring data-focus-visible:ring-ring/50 data-focus-visible:ring-[3px] z-10 -me-px -ms-9 flex w-9 items-center justify-center rounded-e-md text-muted-foreground/80 outline-none transition-[color,box-shadow] hover:text-foreground'>

                          <CalendarIcon size={16} />

                        </Buttons>

                      </div>

                      <Popover

                        className='data-entering:animate-in data-exiting:animate-out outline-hidden z-50 rounded-lg border bg-background text-popover-foreground shadow-lg data-[entering]:fade-in-0 data-[exiting]:fade-out-0 data-[entering]:zoom-in-95 data-[exiting]:zoom-out-95 data-[placement=bottom]:slide-in-from-top-2 data-[placement=left]:slide-in-from-right-2 data-[placement=right]:slide-in-from-left-2 data-[placement=top]:slide-in-from-bottom-2'

                        offset={4}

                      >

                        <Dialog className='max-h-[inherit] overflow-auto p-2'>

                          <Calendar />

                        </Dialog>

                      </Popover>

                    </DatePicker>

                    <FormMessage />

                  </FormItem>

                )}

              />

            </div>

          </div>

          <FormField

            control={form.control}

            name='address'

            render={({ field }) => (

              <FormItem>

                <FormLabel>Địa chỉ</FormLabel>

                <FormControl>

                  <Input

                    placeholder='VD: Số nhà 123, Đường ABC, Huyện XYZ, TP Hà Nội'

                    type='text'

                    {...field}

                  />

                </FormControl>

                <FormMessage />

              </FormItem>

            )}

          />

”